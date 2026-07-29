"""Backend tests for Services rich CMS endpoints."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://construction-modern.preview.emergentagent.com').rstrip('/')
ADMIN_EMAIL = 'admin@synergieconstruction.com'
ADMIN_PASSWORD = 'Synergie2025!'


@pytest.fixture(scope='module')
def api():
    s = requests.Session()
    s.headers.update({'Content-Type': 'application/json'})
    return s


@pytest.fixture(scope='module')
def token(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD})
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    return r.json()['access_token']


@pytest.fixture(scope='module')
def auth_headers(token):
    return {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}


# ---------- Public services ----------
class TestPublicServices:
    def test_list_services(self, api):
        r = api.get(f"{BASE_URL}/api/public/services")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 6, f"expected at least 6 services, got {len(data)}"
        s = data[0]
        for field in ['id', 'slug', 'title', 'image', 'hero_image', 'features', 'sub_services', 'faqs', 'cta_title', 'cta_text', 'cta_button_label']:
            assert field in s, f"Missing field {field}"

    def test_get_by_slug_etudes_fondations(self, api):
        r = api.get(f"{BASE_URL}/api/public/services/etudes-fondations")
        assert r.status_code == 200
        s = r.json()
        assert s['slug'] == 'etudes-fondations'
        assert len(s['features']) >= 2
        assert len(s['sub_services']) >= 1
        assert len(s['faqs']) >= 1
        assert s['cta_title']
        assert s['cta_text']

    def test_get_nonexistent_slug_404(self, api):
        r = api.get(f"{BASE_URL}/api/public/services/nonexistent-slug-xyz")
        assert r.status_code == 404


# ---------- Admin auth + list ----------
class TestAdminServices:
    def test_admin_login(self, token):
        assert isinstance(token, str) and len(token) > 10

    def test_admin_list_all(self, api, auth_headers):
        r = api.get(f"{BASE_URL}/api/admin/services", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 6

    def test_create_full_service_and_verify(self, api, auth_headers):
        payload = {
            'title': 'TEST_ Nouveau Service',
            'short': 'court',
            'description': 'desc',
            'long_description': 'long desc',
            'image': 'https://example.com/img.jpg',
            'hero_image': 'https://example.com/hero.jpg',
            'icon': 'Hammer',
            'features': ['f1', 'f2'],
            'gallery': ['https://example.com/g1.jpg'],
            'sub_services': [{'title': 'sub1', 'description': 'sd', 'icon': 'Box'}],
            'faqs': [{'question': 'Q1', 'answer': 'A1'}],
            'cta_title': 'CTA Title',
            'cta_text': 'CTA Text',
            'cta_button_label': 'Click',
            'seo_title': 'SEO T',
            'seo_description': 'SEO D',
            'seo_og_image': 'https://example.com/og.jpg',
            'slug': 'test-new-service-cms',
            'featured': False,
            'published': True,
            'order': 99,
        }
        r = api.post(f"{BASE_URL}/api/admin/services", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        created = r.json()
        assert created['slug'] == 'test-new-service-cms'
        assert len(created['sub_services']) == 1
        assert len(created['faqs']) == 1
        assert created['cta_title'] == 'CTA Title'

        # Verify via public GET
        r2 = api.get(f"{BASE_URL}/api/public/services/test-new-service-cms")
        assert r2.status_code == 200
        s = r2.json()
        assert s['sub_services'][0]['title'] == 'sub1'
        assert s['faqs'][0]['question'] == 'Q1'

        # Update
        payload['cta_title'] = 'Updated CTA'
        payload['sub_services'] = [{'title': 'sub-updated', 'description': 'x', 'icon': 'Box'}]
        payload['faqs'] = [{'question': 'Q2', 'answer': 'A2'}]
        payload['seo_title'] = 'Updated SEO'
        r3 = api.patch(f"{BASE_URL}/api/admin/services/{created['id']}", json=payload, headers=auth_headers)
        assert r3.status_code == 200, r3.text
        updated = r3.json()
        assert updated['cta_title'] == 'Updated CTA'

        r4 = api.get(f"{BASE_URL}/api/public/services/test-new-service-cms")
        assert r4.status_code == 200
        s4 = r4.json()
        assert s4['cta_title'] == 'Updated CTA'
        assert s4['sub_services'][0]['title'] == 'sub-updated'
        assert s4['faqs'][0]['question'] == 'Q2'
        assert s4['seo_title'] == 'Updated SEO'

        # Delete (super_admin required)
        r5 = api.delete(f"{BASE_URL}/api/admin/services/{created['id']}", headers=auth_headers)
        assert r5.status_code == 200, r5.text

        # verify 404
        r6 = api.get(f"{BASE_URL}/api/public/services/test-new-service-cms")
        assert r6.status_code == 404

    def test_legacy_payload_backward_compat(self, api, auth_headers):
        """Create service with only legacy fields (no sub_services/faqs/CTA)."""
        payload = {
            'title': 'TEST_ Legacy',
            'short': 's',
            'description': 'd',
            'slug': 'test-legacy-service',
            'features': ['a', 'b'],
        }
        r = api.post(f"{BASE_URL}/api/admin/services", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        created = r.json()
        assert created['sub_services'] == []
        assert created['faqs'] == []
        assert created['cta_button_label'] == 'Demander un devis'
        # cleanup
        api.delete(f"{BASE_URL}/api/admin/services/{created['id']}", headers=auth_headers)
