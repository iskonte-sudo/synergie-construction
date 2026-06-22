#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Synergie Construction
Tests all endpoints according to the test plan
"""

import requests
import json
import io
from pathlib import Path

# Configuration
BASE_URL = "https://construction-modern.preview.emergentagent.com/api"
ADMIN_EMAIL = "admin@synergieconstruction.com"
ADMIN_PASSWORD = "Synergie2025!"

# Global variables to store test data
admin_token = None
editor_token = None
test_quote_id = None
test_message_id = None
test_simulation_id = None
test_project_id = None
test_service_id = None
test_user_id = None
test_media_id = None

def print_test(name):
    print(f"\n{'='*60}")
    print(f"TEST: {name}")
    print('='*60)

def print_result(success, message=""):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {message}")
    return success

def test_auth_login_success():
    """Test 1.1: POST /api/auth/login with correct credentials"""
    global admin_token
    print_test("Authentication - Login with correct credentials")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'access_token' in data and 'user' in data:
                admin_token = data['access_token']
                print(f"Token received: {admin_token[:20]}...")
                print(f"User: {data['user']['email']} ({data['user']['role']})")
                return print_result(True, "Login successful with token and user data")
            else:
                return print_result(False, f"Missing access_token or user in response: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_auth_login_wrong_password():
    """Test 1.2: POST /api/auth/login with wrong password"""
    print_test("Authentication - Login with wrong password")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"email": ADMIN_EMAIL, "password": "WrongPassword123!"}
        )
        
        if response.status_code == 401:
            return print_result(True, "Correctly returned 401 for wrong password")
        else:
            return print_result(False, f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_auth_me_with_token():
    """Test 1.3: GET /api/auth/me with valid token"""
    print_test("Authentication - Get current user with valid token")
    
    try:
        response = requests.get(
            f"{BASE_URL}/auth/me",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'email' in data and data['email'] == ADMIN_EMAIL:
                return print_result(True, f"User data retrieved: {data['email']} ({data['role']})")
            else:
                return print_result(False, f"Unexpected user data: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_auth_me_without_token():
    """Test 1.4: GET /api/auth/me without token"""
    print_test("Authentication - Get current user without token")
    
    try:
        response = requests.get(f"{BASE_URL}/auth/me")
        
        if response.status_code == 401:
            return print_result(True, "Correctly returned 401 without token")
        else:
            return print_result(False, f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_public_quote_submission():
    """Test 2.1: POST /api/public/quotes"""
    global test_quote_id
    print_test("Public - Submit quote request")
    
    try:
        payload = {
            "service": "etudes-fondations",
            "service_title": "Étude de fondations",
            "name": "Jean Dupont",
            "email": "jean.dupont@example.com",
            "phone": "+221 77 123 45 67",
            "values": {
                "typeBatiment": "Villa",
                "surface": "200m²",
                "localisation": "Dakar"
            }
        }
        
        response = requests.post(f"{BASE_URL}/public/quotes", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and data['name'] == payload['name']:
                test_quote_id = data['id']
                print(f"Quote created with ID: {test_quote_id}")
                return print_result(True, "Quote submitted successfully")
            else:
                return print_result(False, f"Unexpected response: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_public_message_submission():
    """Test 2.2: POST /api/public/messages"""
    global test_message_id
    print_test("Public - Submit contact message")
    
    try:
        payload = {
            "name": "Marie Martin",
            "email": "marie.martin@example.com",
            "phone": "+221 77 987 65 43",
            "subject": "Demande d'information",
            "message": "Bonjour, je souhaite obtenir plus d'informations sur vos services de construction."
        }
        
        response = requests.post(f"{BASE_URL}/public/messages", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and data['name'] == payload['name']:
                test_message_id = data['id']
                print(f"Message created with ID: {test_message_id}")
                return print_result(True, "Message submitted successfully")
            else:
                return print_result(False, f"Unexpected response: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_public_simulation_submission():
    """Test 2.3: POST /api/public/simulations"""
    global test_simulation_id
    print_test("Public - Submit project simulation")
    
    try:
        payload = {
            "project_type": "Villa individuelle",
            "surface": "150m²",
            "prestations": ["Gros œuvre", "Second œuvre", "Finitions"],
            "budget": "50-75M FCFA",
            "delai": "6-9 mois",
            "contact": {
                "name": "Amadou Diallo",
                "email": "amadou.diallo@example.com",
                "phone": "+221 77 555 44 33"
            },
            "estimate_low": 50000000,
            "estimate_high": 75000000,
            "months_low": 6,
            "months_high": 9
        }
        
        response = requests.post(f"{BASE_URL}/public/simulations", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and 'reference' in data:
                test_simulation_id = data['id']
                print(f"Simulation created with ID: {test_simulation_id}, Ref: {data['reference']}")
                return print_result(True, "Simulation submitted successfully")
            else:
                return print_result(False, f"Unexpected response: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_public_visit_tracking():
    """Test 2.4: POST /api/public/visits"""
    print_test("Public - Track page visit")
    
    try:
        payload = {
            "path": "/",
            "referrer": "https://google.com",
            "user_agent": "Mozilla/5.0 Test Agent"
        }
        
        response = requests.post(f"{BASE_URL}/public/visits", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('ok') == True:
                return print_result(True, "Visit tracked successfully")
            else:
                return print_result(False, f"Unexpected response: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_public_projects_list():
    """Test 2.5: GET /api/public/projects"""
    print_test("Public - List published projects")
    
    try:
        response = requests.get(f"{BASE_URL}/public/projects")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} published projects")
            return print_result(True, "Projects list retrieved (empty list OK)")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_public_services_list():
    """Test 2.6: GET /api/public/services"""
    print_test("Public - List published services")
    
    try:
        response = requests.get(f"{BASE_URL}/public/services")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} published services")
            return print_result(True, "Services list retrieved (empty list OK)")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_public_settings():
    """Test 2.7: GET /api/public/settings"""
    print_test("Public - Get site settings")
    
    try:
        response = requests.get(f"{BASE_URL}/public/settings")
        
        if response.status_code == 200:
            data = response.json()
            if 'company_name' in data and 'socials' in data:
                print(f"Company: {data['company_name']}")
                print(f"Socials: {len(data['socials'])} links")
                return print_result(True, "Settings retrieved with seeded socials")
            else:
                return print_result(False, f"Missing expected fields: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_dashboard():
    """Test 3.1: GET /api/admin/dashboard"""
    print_test("Admin - Get dashboard stats")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/dashboard",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            required_keys = ['stats', 'months', 'top_pages', 'recent_quotes', 'recent_messages']
            if all(key in data for key in required_keys):
                print(f"Stats: {data['stats']}")
                print(f"Months data: {len(data['months'])} entries")
                print(f"Top pages: {len(data['top_pages'])} entries")
                return print_result(True, "Dashboard data complete")
            else:
                return print_result(False, f"Missing required keys. Got: {list(data.keys())}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_quotes_list():
    """Test 3.2: GET /api/admin/quotes"""
    print_test("Admin - List quotes")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/quotes",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} quotes")
            # Check if our test quote is in the list
            if test_quote_id:
                found = any(q['id'] == test_quote_id for q in data)
                if found:
                    return print_result(True, f"Quotes list retrieved, includes test quote {test_quote_id}")
                else:
                    return print_result(False, f"Test quote {test_quote_id} not found in list")
            return print_result(True, "Quotes list retrieved")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_quotes_update():
    """Test 3.3: PATCH /api/admin/quotes/{id}"""
    print_test("Admin - Update quote status")
    
    if not test_quote_id:
        return print_result(False, "No test quote ID available")
    
    try:
        payload = {
            "status": "en_cours",
            "notes": "Note de test - devis en cours de traitement"
        }
        
        response = requests.patch(
            f"{BASE_URL}/admin/quotes/{test_quote_id}",
            json=payload,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'en_cours' and data.get('notes') == payload['notes']:
                return print_result(True, "Quote updated successfully")
            else:
                return print_result(False, f"Update not reflected: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_quotes_export():
    """Test 3.4: GET /api/admin/quotes/export"""
    print_test("Admin - Export quotes to Excel")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/quotes/export",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            if 'spreadsheet' in content_type or 'excel' in content_type:
                print(f"Content-Type: {content_type}")
                print(f"Content-Length: {len(response.content)} bytes")
                return print_result(True, "Excel file exported successfully")
            else:
                return print_result(False, f"Wrong content-type: {content_type}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_messages_list():
    """Test 3.5: GET /api/admin/messages"""
    print_test("Admin - List messages")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/messages",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} messages")
            if test_message_id:
                found = any(m['id'] == test_message_id for m in data)
                if found:
                    return print_result(True, f"Messages list retrieved, includes test message {test_message_id}")
                else:
                    return print_result(False, f"Test message {test_message_id} not found in list")
            return print_result(True, "Messages list retrieved")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_messages_update():
    """Test 3.6: PATCH /api/admin/messages/{id}"""
    print_test("Admin - Reply to message")
    
    if not test_message_id:
        return print_result(False, "No test message ID available")
    
    try:
        payload = {
            "reply": "Bonjour, merci pour votre message. Nous vous recontacterons sous peu.",
            "status": "repondu"
        }
        
        response = requests.patch(
            f"{BASE_URL}/admin/messages/{test_message_id}",
            json=payload,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'repondu' and data.get('reply') == payload['reply']:
                return print_result(True, "Message replied successfully")
            else:
                return print_result(False, f"Update not reflected: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_simulations_list():
    """Test 3.7: GET /api/admin/simulations"""
    print_test("Admin - List simulations")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/simulations",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} simulations")
            if test_simulation_id:
                found = any(s['id'] == test_simulation_id for s in data)
                if found:
                    return print_result(True, f"Simulations list retrieved, includes test simulation {test_simulation_id}")
                else:
                    return print_result(False, f"Test simulation {test_simulation_id} not found in list")
            return print_result(True, "Simulations list retrieved")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_simulations_export():
    """Test 3.8: GET /api/admin/simulations/export"""
    print_test("Admin - Export simulations to Excel")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/simulations/export",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            if 'spreadsheet' in content_type or 'excel' in content_type:
                print(f"Content-Type: {content_type}")
                print(f"Content-Length: {len(response.content)} bytes")
                return print_result(True, "Excel file exported successfully")
            else:
                return print_result(False, f"Wrong content-type: {content_type}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_projects_create():
    """Test 3.9: POST /api/admin/projects"""
    global test_project_id
    print_test("Admin - Create project")
    
    try:
        payload = {
            "title": "Villa Moderne Almadies",
            "category": "Résidentiel",
            "location": "Almadies, Dakar",
            "year": 2025,
            "description": "Construction d'une villa moderne de standing avec piscine et jardin paysager.",
            "status": "termine",
            "featured": True,
            "published": True
        }
        
        response = requests.post(
            f"{BASE_URL}/admin/projects",
            json=payload,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and data['title'] == payload['title']:
                test_project_id = data['id']
                print(f"Project created with ID: {test_project_id}")
                return print_result(True, "Project created successfully")
            else:
                return print_result(False, f"Unexpected response: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_projects_list():
    """Test 3.10: GET /api/admin/projects"""
    print_test("Admin - List all projects")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/projects",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} projects")
            if test_project_id:
                found = any(p['id'] == test_project_id for p in data)
                if found:
                    return print_result(True, f"Projects list retrieved, includes test project {test_project_id}")
                else:
                    return print_result(False, f"Test project {test_project_id} not found in list")
            return print_result(True, "Projects list retrieved")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_projects_update():
    """Test 3.11: PATCH /api/admin/projects/{id}"""
    print_test("Admin - Update project")
    
    if not test_project_id:
        return print_result(False, "No test project ID available")
    
    try:
        payload = {
            "title": "Villa Moderne Almadies - UPDATED",
            "category": "Résidentiel",
            "location": "Almadies, Dakar",
            "year": 2025,
            "description": "Description mise à jour avec plus de détails.",
            "status": "termine",
            "featured": False,
            "published": True
        }
        
        response = requests.patch(
            f"{BASE_URL}/admin/projects/{test_project_id}",
            json=payload,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('title') == payload['title']:
                return print_result(True, "Project updated successfully")
            else:
                return print_result(False, f"Update not reflected: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_projects_delete():
    """Test 3.12: DELETE /api/admin/projects/{id}"""
    print_test("Admin - Delete project")
    
    if not test_project_id:
        return print_result(False, "No test project ID available")
    
    try:
        response = requests.delete(
            f"{BASE_URL}/admin/projects/{test_project_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('ok') == True:
                return print_result(True, "Project deleted successfully")
            else:
                return print_result(False, f"Unexpected response: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_services_create():
    """Test 3.13: POST /api/admin/services"""
    global test_service_id
    print_test("Admin - Create service")
    
    try:
        payload = {
            "title": "Service de Test",
            "short": "Description courte du service de test",
            "description": "Description complète du service de test avec tous les détails nécessaires.",
            "long_description": "Description longue et détaillée du service.",
            "icon": "Hammer",
            "slug": "service-test-unique",
            "features": ["Feature 1", "Feature 2", "Feature 3"],
            "featured": True,
            "published": True,
            "order": 10
        }
        
        response = requests.post(
            f"{BASE_URL}/admin/services",
            json=payload,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and data['slug'] == payload['slug']:
                test_service_id = data['id']
                print(f"Service created with ID: {test_service_id}")
                return print_result(True, "Service created successfully")
            else:
                return print_result(False, f"Unexpected response: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_services_list():
    """Test 3.14: GET /api/admin/services"""
    print_test("Admin - List all services")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/services",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} services")
            if test_service_id:
                found = any(s['id'] == test_service_id for s in data)
                if found:
                    return print_result(True, f"Services list retrieved, includes test service {test_service_id}")
                else:
                    return print_result(False, f"Test service {test_service_id} not found in list")
            return print_result(True, "Services list retrieved")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_services_update():
    """Test 3.15: PATCH /api/admin/services/{id}"""
    print_test("Admin - Update service")
    
    if not test_service_id:
        return print_result(False, "No test service ID available")
    
    try:
        payload = {
            "title": "Service de Test - UPDATED",
            "short": "Description mise à jour",
            "description": "Description complète mise à jour.",
            "long_description": "Description longue mise à jour.",
            "icon": "Wrench",
            "slug": "service-test-unique",
            "features": ["Feature A", "Feature B"],
            "featured": False,
            "published": True,
            "order": 20
        }
        
        response = requests.patch(
            f"{BASE_URL}/admin/services/{test_service_id}",
            json=payload,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('title') == payload['title']:
                return print_result(True, "Service updated successfully")
            else:
                return print_result(False, f"Update not reflected: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_services_delete():
    """Test 3.16: DELETE /api/admin/services/{id}"""
    print_test("Admin - Delete service")
    
    if not test_service_id:
        return print_result(False, "No test service ID available")
    
    try:
        response = requests.delete(
            f"{BASE_URL}/admin/services/{test_service_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('ok') == True:
                return print_result(True, "Service deleted successfully")
            else:
                return print_result(False, f"Unexpected response: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_settings_get():
    """Test 3.17: GET /api/admin/settings"""
    print_test("Admin - Get settings")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/settings",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'company_name' in data and 'phone' in data:
                print(f"Company: {data['company_name']}")
                print(f"Phone: {data['phone']}")
                return print_result(True, "Settings retrieved successfully")
            else:
                return print_result(False, f"Missing expected fields: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_settings_update():
    """Test 3.18: PUT /api/admin/settings"""
    print_test("Admin - Update settings (partial)")
    
    try:
        payload = {
            "phone_display": "+221 33 333 33 33"
        }
        
        response = requests.put(
            f"{BASE_URL}/admin/settings",
            json=payload,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('phone_display') == payload['phone_display']:
                return print_result(True, "Settings updated successfully (partial update)")
            else:
                return print_result(False, f"Update not reflected: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_users_list():
    """Test 3.19: GET /api/admin/users (super_admin only)"""
    print_test("Admin - List users (super_admin only)")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/users",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} users")
            # Check if seeded admin is in the list
            found_admin = any(u['email'] == ADMIN_EMAIL for u in data)
            if found_admin:
                return print_result(True, f"Users list retrieved, includes seeded admin")
            else:
                return print_result(False, "Seeded admin not found in users list")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_users_create():
    """Test 3.20: POST /api/admin/users"""
    global test_user_id
    print_test("Admin - Create user")
    
    try:
        payload = {
            "email": "editor.test@synergieconstruction.com",
            "name": "Éditeur Test",
            "role": "editor",
            "password": "Editor2025!",
            "active": True
        }
        
        response = requests.post(
            f"{BASE_URL}/admin/users",
            json=payload,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and data['email'] == payload['email']:
                test_user_id = data['id']
                print(f"User created with ID: {test_user_id}")
                return print_result(True, "User created successfully")
            else:
                return print_result(False, f"Unexpected response: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_users_update():
    """Test 3.21: PATCH /api/admin/users/{id}"""
    print_test("Admin - Update user")
    
    if not test_user_id:
        return print_result(False, "No test user ID available")
    
    try:
        payload = {
            "name": "Éditeur Test - UPDATED"
        }
        
        response = requests.patch(
            f"{BASE_URL}/admin/users/{test_user_id}",
            json=payload,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('name') == payload['name']:
                return print_result(True, "User updated successfully")
            else:
                return print_result(False, f"Update not reflected: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_users_delete():
    """Test 3.22: DELETE /api/admin/users/{id}"""
    print_test("Admin - Delete user")
    
    if not test_user_id:
        return print_result(False, "No test user ID available")
    
    try:
        response = requests.delete(
            f"{BASE_URL}/admin/users/{test_user_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('ok') == True:
                return print_result(True, "User deleted successfully")
            else:
                return print_result(False, f"Unexpected response: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_admin_audit_logs():
    """Test 3.23: GET /api/admin/audit-logs"""
    print_test("Admin - Get audit logs")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/audit-logs",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} audit log entries")
            if len(data) > 0:
                print(f"Sample log: {data[0].get('action')} by {data[0].get('user_email')}")
                return print_result(True, "Audit logs retrieved with entries")
            else:
                return print_result(True, "Audit logs retrieved (empty)")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_authorization_no_token():
    """Test 4.1: All /api/admin/* endpoints without token → 401"""
    print_test("Authorization - Admin endpoint without token")
    
    try:
        response = requests.get(f"{BASE_URL}/admin/dashboard")
        
        if response.status_code == 401:
            return print_result(True, "Correctly returned 401 without token")
        else:
            return print_result(False, f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_authorization_editor_users_endpoint():
    """Test 4.2: /api/admin/users with editor role → 403"""
    global editor_token
    print_test("Authorization - Editor accessing users endpoint (should be 403)")
    
    # First, create an editor user and login
    try:
        # Create editor
        editor_email = "editor.auth.test@synergieconstruction.com"
        editor_password = "EditorAuth2025!"
        
        create_response = requests.post(
            f"{BASE_URL}/admin/users",
            json={
                "email": editor_email,
                "name": "Editor Auth Test",
                "role": "editor",
                "password": editor_password,
                "active": True
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if create_response.status_code != 200:
            return print_result(False, f"Failed to create editor user: {create_response.text}")
        
        editor_user_id = create_response.json()['id']
        
        # Login as editor
        login_response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"email": editor_email, "password": editor_password}
        )
        
        if login_response.status_code != 200:
            return print_result(False, f"Failed to login as editor: {login_response.text}")
        
        editor_token = login_response.json()['access_token']
        
        # Try to access /admin/users with editor token
        users_response = requests.get(
            f"{BASE_URL}/admin/users",
            headers={"Authorization": f"Bearer {editor_token}"}
        )
        
        # Clean up: delete the editor user
        requests.delete(
            f"{BASE_URL}/admin/users/{editor_user_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if users_response.status_code == 403:
            return print_result(True, "Correctly returned 403 for editor accessing users endpoint")
        else:
            return print_result(False, f"Expected 403, got {users_response.status_code}: {users_response.text}")
            
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_media_upload():
    """Test 5.1: POST /api/admin/media with test image"""
    global test_media_id
    print_test("Media - Upload test image")
    
    try:
        # Create a small test image (1x1 pixel PNG)
        test_image_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
        
        files = {
            'file': ('test_image.png', io.BytesIO(test_image_data), 'image/png')
        }
        data = {
            'folder': 'test'
        }
        
        response = requests.post(
            f"{BASE_URL}/admin/media",
            files=files,
            data=data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            result = response.json()
            if 'id' in result and 'url' in result:
                test_media_id = result['id']
                print(f"Media uploaded with ID: {test_media_id}")
                print(f"URL: {result['url']}")
                return print_result(True, "Media uploaded successfully")
            else:
                return print_result(False, f"Unexpected response: {result}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_media_list():
    """Test 5.2: GET /api/admin/media"""
    print_test("Media - List uploaded media")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/media",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} media items")
            if test_media_id:
                found = any(m['id'] == test_media_id for m in data)
                if found:
                    return print_result(True, f"Media list retrieved, includes test media {test_media_id}")
                else:
                    return print_result(False, f"Test media {test_media_id} not found in list")
            return print_result(True, "Media list retrieved")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_media_access():
    """Test 5.3: Access uploaded media file"""
    print_test("Media - Access uploaded file via URL")
    
    if not test_media_id:
        return print_result(False, "No test media ID available")
    
    try:
        # Get media details first
        list_response = requests.get(
            f"{BASE_URL}/admin/media",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if list_response.status_code != 200:
            return print_result(False, "Failed to get media list")
        
        media_items = list_response.json()
        test_media = next((m for m in media_items if m['id'] == test_media_id), None)
        
        if not test_media:
            return print_result(False, "Test media not found in list")
        
        media_url = test_media['url']
        # Construct full URL (remove /api prefix if present)
        full_url = f"https://construction-modern.preview.emergentagent.com{media_url}"
        
        print(f"Accessing: {full_url}")
        
        response = requests.get(full_url)
        
        if response.status_code == 200:
            print(f"Content-Type: {response.headers.get('content-type')}")
            print(f"Content-Length: {len(response.content)} bytes")
            return print_result(True, "Media file accessible via URL")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_media_delete():
    """Test 5.4: DELETE /api/admin/media/{id}"""
    print_test("Media - Delete uploaded media")
    
    if not test_media_id:
        return print_result(False, "No test media ID available")
    
    try:
        response = requests.delete(
            f"{BASE_URL}/admin/media/{test_media_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('ok') == True:
                return print_result(True, "Media deleted successfully")
            else:
                return print_result(False, f"Unexpected response: {data}")
        else:
            return print_result(False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def test_password_change():
    """Test 6.1: POST /api/auth/change-password"""
    print_test("Auth - Change password")
    
    try:
        # Change password
        payload = {
            "current_password": ADMIN_PASSWORD,
            "new_password": "NewPass2025!"
        }
        
        response = requests.post(
            f"{BASE_URL}/auth/change-password",
            json=payload,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response.status_code != 200:
            return print_result(False, f"Failed to change password: {response.status_code} {response.text}")
        
        # Change it back
        payload_back = {
            "current_password": "NewPass2025!",
            "new_password": ADMIN_PASSWORD
        }
        
        response_back = requests.post(
            f"{BASE_URL}/auth/change-password",
            json=payload_back,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        if response_back.status_code == 200:
            return print_result(True, "Password changed and reverted successfully")
        else:
            return print_result(False, f"Failed to revert password: {response_back.status_code} {response_back.text}")
            
    except Exception as e:
        return print_result(False, f"Exception: {str(e)}")

def main():
    """Run all tests in order"""
    print("\n" + "="*60)
    print("SYNERGIE CONSTRUCTION BACKEND API TEST SUITE")
    print("="*60)
    print(f"Base URL: {BASE_URL}")
    print(f"Admin: {ADMIN_EMAIL}")
    print("="*60)
    
    results = []
    
    # 1. Authentication Tests
    results.append(("Auth - Login Success", test_auth_login_success()))
    results.append(("Auth - Login Wrong Password", test_auth_login_wrong_password()))
    results.append(("Auth - Get Me With Token", test_auth_me_with_token()))
    results.append(("Auth - Get Me Without Token", test_auth_me_without_token()))
    
    # 2. Public Endpoints Tests
    results.append(("Public - Quote Submission", test_public_quote_submission()))
    results.append(("Public - Message Submission", test_public_message_submission()))
    results.append(("Public - Simulation Submission", test_public_simulation_submission()))
    results.append(("Public - Visit Tracking", test_public_visit_tracking()))
    results.append(("Public - Projects List", test_public_projects_list()))
    results.append(("Public - Services List", test_public_services_list()))
    results.append(("Public - Settings", test_public_settings()))
    
    # 3. Admin Endpoints Tests
    results.append(("Admin - Dashboard", test_admin_dashboard()))
    results.append(("Admin - Quotes List", test_admin_quotes_list()))
    results.append(("Admin - Quotes Update", test_admin_quotes_update()))
    results.append(("Admin - Quotes Export", test_admin_quotes_export()))
    results.append(("Admin - Messages List", test_admin_messages_list()))
    results.append(("Admin - Messages Update", test_admin_messages_update()))
    results.append(("Admin - Simulations List", test_admin_simulations_list()))
    results.append(("Admin - Simulations Export", test_admin_simulations_export()))
    results.append(("Admin - Projects Create", test_admin_projects_create()))
    results.append(("Admin - Projects List", test_admin_projects_list()))
    results.append(("Admin - Projects Update", test_admin_projects_update()))
    results.append(("Admin - Projects Delete", test_admin_projects_delete()))
    results.append(("Admin - Services Create", test_admin_services_create()))
    results.append(("Admin - Services List", test_admin_services_list()))
    results.append(("Admin - Services Update", test_admin_services_update()))
    results.append(("Admin - Services Delete", test_admin_services_delete()))
    results.append(("Admin - Settings Get", test_admin_settings_get()))
    results.append(("Admin - Settings Update", test_admin_settings_update()))
    results.append(("Admin - Users List", test_admin_users_list()))
    results.append(("Admin - Users Create", test_admin_users_create()))
    results.append(("Admin - Users Update", test_admin_users_update()))
    results.append(("Admin - Users Delete", test_admin_users_delete()))
    results.append(("Admin - Audit Logs", test_admin_audit_logs()))
    
    # 4. Authorization Tests
    results.append(("Authorization - No Token", test_authorization_no_token()))
    results.append(("Authorization - Editor Users Access", test_authorization_editor_users_endpoint()))
    
    # 5. Media Upload Tests
    results.append(("Media - Upload", test_media_upload()))
    results.append(("Media - List", test_media_list()))
    results.append(("Media - Access File", test_media_access()))
    results.append(("Media - Delete", test_media_delete()))
    
    # 6. Password Change Test
    results.append(("Auth - Password Change", test_password_change()))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    failed = len(results) - passed
    
    print(f"\nTotal Tests: {len(results)}")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    
    if failed > 0:
        print("\n❌ FAILED TESTS:")
        for name, result in results:
            if not result:
                print(f"  - {name}")
    
    print("\n" + "="*60)
    
    return failed == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
