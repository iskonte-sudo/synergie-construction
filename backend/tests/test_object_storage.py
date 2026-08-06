"""Tests for Emergent Object Storage integration in media upload/serving."""
import os
import re
import io
import time
import struct
import zlib
import subprocess
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://construction-modern.preview.emergentagent.com').rstrip('/')
ADMIN_EMAIL = 'admin@synergieconstruction.com'
ADMIN_PASSWORD = 'Synergie2025!'
LOCAL_UPLOADS = '/app/backend/uploads'


def _make_png_bytes():
    """Generate a valid minimal 2x2 PNG (uncompressed)."""
    sig = b'\x89PNG\r\n\x1a\n'
    def chunk(t, d):
        return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', 2, 2, 8, 2, 0, 0, 0))
    raw = b'\x00' + b'\xff\x00\x00\xff\x00\x00' + b'\x00' + b'\x00\xff\x00\x00\xff\x00'
    idat = chunk(b'IDAT', zlib.compress(raw))
    iend = chunk(b'IEND', b'')
    return sig + ihdr + idat + iend


def _make_mp4_bytes():
    # Small binary with .mp4 extension; storage doesn't validate contents.
    return b'\x00\x00\x00\x20ftypisom' + os.urandom(512)


@pytest.fixture(scope='module')
def admin_token():
    r = requests.post(f'{BASE_URL}/api/auth/login',
                      json={'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f'login failed: {r.status_code} {r.text}'
    return r.json()['access_token']


@pytest.fixture(scope='module')
def headers(admin_token):
    return {'Authorization': f'Bearer {admin_token}'}


class TestStartupLog:
    def test_startup_log_contains_ready(self):
        try:
            out = subprocess.check_output(
                "grep -l 'Emergent object storage ready' /var/log/supervisor/backend.*.log",
                shell=True, text=True
            )
            assert out.strip(), 'log line not found'
        except subprocess.CalledProcessError:
            pytest.fail("'Emergent object storage ready' not present in backend logs")


class TestPngUpload:
    def test_upload_png_and_verify_roundtrip(self, headers):
        png = _make_png_bytes()
        files = {'file': ('test.png', png, 'image/png')}
        data = {'folder': 'storage-test'}
        r = requests.post(f'{BASE_URL}/api/admin/media', headers=headers, files=files, data=data, timeout=60)
        assert r.status_code == 200, r.text
        body = r.json()
        url = body['url']
        assert re.match(r'^/api/uploads/storage-test/[a-f0-9]+\.png$', url), f'bad url shape: {url}'
        assert body['mime'] == 'image/png'
        # not on local disk
        fname = url.split('/')[-1]
        local = os.path.join(LOCAL_UPLOADS, 'storage-test', fname)
        assert not os.path.exists(local), f'file should not be on local disk: {local}'
        # GET via public URL
        r2 = requests.get(f'{BASE_URL}{url}', timeout=60)
        assert r2.status_code == 200
        assert r2.headers.get('content-type', '').startswith('image/png')
        assert r2.content == png, 'bytes not byte-identical'
        # store for persistence test
        pytest.png_url = url
        pytest.png_bytes = png

    def test_persistence_across_restart(self, headers):
        assert getattr(pytest, 'png_url', None), 'previous upload test must have run'
        subprocess.check_call(['sudo', 'supervisorctl', 'restart', 'backend'])
        # wait for backend
        for _ in range(20):
            time.sleep(1)
            try:
                if requests.get(f'{BASE_URL}/api/', timeout=5).status_code == 200:
                    break
            except Exception:
                pass
        time.sleep(2)
        r = requests.get(f'{BASE_URL}{pytest.png_url}', timeout=60)
        assert r.status_code == 200
        assert r.content == pytest.png_bytes, 'bytes changed after restart'


class TestMp4Upload:
    def test_upload_mp4(self, headers):
        mp4 = _make_mp4_bytes()
        files = {'file': ('tiny.mp4', mp4, 'video/mp4')}
        data = {'folder': 'storage-test'}
        r = requests.post(f'{BASE_URL}/api/admin/media', headers=headers, files=files, data=data, timeout=60)
        assert r.status_code == 200, r.text
        body = r.json()
        url = body['url']
        assert re.match(r'^/api/uploads/storage-test/[a-f0-9]+\.mp4$', url)
        assert body['mime'] == 'video/mp4'
        r2 = requests.get(f'{BASE_URL}{url}', timeout=60)
        assert r2.status_code == 200
        assert r2.headers.get('content-type', '').startswith('video/mp4')
        assert r2.content == mp4


class TestLegacyFallbackAnd404:
    def test_legacy_local_file_served(self):
        slides_dir = os.path.join(LOCAL_UPLOADS, 'slides')
        pngs = [f for f in os.listdir(slides_dir) if f.endswith('.png')]
        if not pngs:
            pytest.skip('no legacy slides png present')
        fname = pngs[0]
        r = requests.get(f'{BASE_URL}/api/uploads/slides/{fname}', timeout=30)
        assert r.status_code == 200
        assert r.headers.get('content-type', '').startswith('image/png')

    def test_404_for_missing(self):
        r = requests.get(f'{BASE_URL}/api/uploads/does/not/exist.png', timeout=30)
        assert r.status_code == 404


class TestDbIntegrity:
    def test_media_list_contains_new_upload(self, headers):
        assert getattr(pytest, 'png_url', None), 'upload test must run first'
        r = requests.get(f'{BASE_URL}/api/admin/media', headers=headers, params={'folder': 'storage-test'}, timeout=30)
        assert r.status_code == 200
        items = r.json()
        urls = [m['url'] for m in items]
        assert pytest.png_url in urls
        for m in items:
            assert m['url'].startswith('/api/uploads/')
