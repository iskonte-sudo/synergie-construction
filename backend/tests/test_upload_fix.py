"""Tests for image upload fix: /api/uploads/* static mount + legacy URL migration."""
import os
import io
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://construction-modern.preview.emergentagent.com').rstrip('/')
ADMIN_EMAIL = 'admin@synergieconstruction.com'
ADMIN_PASSWORD = 'Synergie2025!'

# Minimal valid PNG (1x1 red pixel)
PNG_BYTES = bytes.fromhex(
    '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4'
    '890000000d49444154789c626001000000050001a5f645400000000049454e44ae426082'
)


@pytest.fixture(scope='module')
def token():
    r = requests.post(f'{BASE_URL}/api/auth/login',
                      json={'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f'Login failed: {r.status_code} {r.text}'
    return r.json()['access_token']


@pytest.fixture(scope='module')
def headers(token):
    return {'Authorization': f'Bearer {token}'}


class TestUploadFix:
    def test_upload_returns_api_uploads_url(self, headers):
        files = {'file': ('TEST_upload.png', io.BytesIO(PNG_BYTES), 'image/png')}
        data = {'folder': 'test'}
        r = requests.post(f'{BASE_URL}/api/admin/media', files=files, data=data,
                          headers=headers, timeout=30)
        assert r.status_code == 200, f'Upload failed: {r.status_code} {r.text}'
        body = r.json()
        assert 'url' in body
        assert body['url'].startswith('/api/uploads/'), f"URL prefix wrong: {body['url']}"
        assert body['url'].endswith('.png')
        # Save for next tests
        pytest.uploaded_url = body['url']
        pytest.uploaded_id = body['id']

    def test_uploaded_file_publicly_accessible(self):
        url = getattr(pytest, 'uploaded_url', None)
        assert url, 'No uploaded URL from previous test'
        full = f'{BASE_URL}{url}'
        r = requests.get(full, timeout=15)
        assert r.status_code == 200, f'GET {full} returned {r.status_code}'
        ctype = r.headers.get('content-type', '')
        assert ctype.startswith('image/'), f'Wrong content-type: {ctype} (expected image/*)'
        assert r.content == PNG_BYTES or len(r.content) == len(PNG_BYTES)

    def test_legacy_uploads_route_not_serving_images(self):
        """GET /uploads/... should NOT return image (K8s ingress routes to frontend SPA)."""
        url = getattr(pytest, 'uploaded_url', None)
        assert url
        legacy = url.replace('/api/uploads/', '/uploads/', 1)
        r = requests.get(f'{BASE_URL}{legacy}', timeout=15, allow_redirects=False)
        ctype = r.headers.get('content-type', '')
        # Must not serve as image — either 404 or SPA HTML
        assert not ctype.startswith('image/'), \
            f'Legacy /uploads/ still serves image (unexpected): {ctype}'

    def test_admin_media_list_all_urls_have_api_prefix(self, headers):
        r = requests.get(f'{BASE_URL}/api/admin/media', headers=headers, timeout=15)
        assert r.status_code == 200
        items = r.json()
        bad = [i for i in items if i.get('url', '').startswith('/uploads/')]
        assert not bad, f'Found {len(bad)} media rows still with /uploads/ prefix (migration missed): {bad[:3]}'

    def test_services_image_urls_migrated(self, headers):
        r = requests.get(f'{BASE_URL}/api/admin/services', headers=headers, timeout=15)
        assert r.status_code == 200
        for svc in r.json():
            for f in ('image', 'hero_image', 'seo_og_image'):
                v = svc.get(f)
                if isinstance(v, str) and v.startswith('/'):
                    assert not v.startswith('/uploads/'), \
                        f"Service {svc.get('slug')} field {f} not migrated: {v}"
            for g in (svc.get('gallery') or []):
                if isinstance(g, str) and g.startswith('/'):
                    assert not g.startswith('/uploads/'), f'Gallery URL not migrated: {g}'

    def test_cleanup_uploaded_media(self, headers):
        mid = getattr(pytest, 'uploaded_id', None)
        if mid:
            r = requests.delete(f'{BASE_URL}/api/admin/media/{mid}', headers=headers, timeout=15)
            assert r.status_code == 200
