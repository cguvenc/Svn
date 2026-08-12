#!/usr/bin/env python3
"""
Backend API Test Suite for SVN Makina
Tests all endpoints at REACT_APP_BACKEND_URL/api
"""
import requests
import json
import sys
from typing import Dict, Optional

# Backend URL from frontend/.env
BASE_URL = "https://tech-roster-3.preview.emergentagent.com/api"

# Admin credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

# Test results tracking
test_results = []
token = None


def log_test(name: str, passed: bool, details: str = ""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    test_results.append({"name": name, "passed": passed, "details": details})
    print(f"{status}: {name}")
    if details:
        print(f"   Details: {details}")


def test_auth_login_success():
    """Test 1: POST /api/auth/login with correct credentials"""
    global token
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data and data.get("token_type") == "bearer":
                token = data["access_token"]
                log_test("Auth Login Success", True, f"Got token: {token[:20]}...")
                return True
            else:
                log_test("Auth Login Success", False, f"Missing access_token or token_type. Response: {data}")
                return False
        else:
            log_test("Auth Login Success", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Auth Login Success", False, f"Exception: {str(e)}")
        return False


def test_auth_login_failure():
    """Test 2: POST /api/auth/login with wrong credentials"""
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": "admin", "password": "wrongpassword"},
            timeout=10
        )
        if response.status_code == 401:
            log_test("Auth Login Failure (401)", True, "Correctly rejected wrong password")
            return True
        else:
            log_test("Auth Login Failure (401)", False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Auth Login Failure (401)", False, f"Exception: {str(e)}")
        return False


def test_auth_me_with_token():
    """Test 3: GET /api/auth/me with valid Bearer token"""
    if not token:
        log_test("Auth /me with token", False, "No token available")
        return False
    try:
        response = requests.get(
            f"{BASE_URL}/auth/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if data.get("username") == ADMIN_USERNAME:
                log_test("Auth /me with token", True, f"Got username: {data['username']}")
                return True
            else:
                log_test("Auth /me with token", False, f"Wrong username: {data}")
                return False
        else:
            log_test("Auth /me with token", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Auth /me with token", False, f"Exception: {str(e)}")
        return False


def test_auth_me_without_token():
    """Test 4: GET /api/auth/me without token (should return 401)"""
    try:
        response = requests.get(f"{BASE_URL}/auth/me", timeout=10)
        if response.status_code == 401:
            log_test("Auth /me without token (401)", True, "Correctly rejected no token")
            return True
        else:
            log_test("Auth /me without token (401)", False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Auth /me without token (401)", False, f"Exception: {str(e)}")
        return False


def test_public_get_settings():
    """Test 5: GET /api/settings (public, should have brand + bilingual fields)"""
    try:
        response = requests.get(f"{BASE_URL}/settings", timeout=10)
        if response.status_code == 200:
            data = response.json()
            required_fields = ["brand", "hero_title_tr", "hero_title_en", "about_p1_tr", "about_p1_en"]
            missing = [f for f in required_fields if f not in data]
            if not missing and data.get("brand") == "SVN MAKİNA":
                log_test("Public GET /settings", True, f"Brand: {data['brand']}")
                return True
            else:
                log_test("Public GET /settings", False, f"Missing fields: {missing} or wrong brand")
                return False
        else:
            log_test("Public GET /settings", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Public GET /settings", False, f"Exception: {str(e)}")
        return False


def test_public_get_services():
    """Test 6: GET /api/services (public, should have 6 seeded services sorted by order)"""
    try:
        response = requests.get(f"{BASE_URL}/services", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) == 6:
                # Check sorted by order
                orders = [s.get("order", 0) for s in data]
                if orders == sorted(orders):
                    log_test("Public GET /services", True, f"Got 6 services sorted by order")
                    return True
                else:
                    log_test("Public GET /services", False, f"Services not sorted by order: {orders}")
                    return False
            else:
                log_test("Public GET /services", False, f"Expected 6 services, got {len(data) if isinstance(data, list) else 'not a list'}")
                return False
        else:
            log_test("Public GET /services", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Public GET /services", False, f"Exception: {str(e)}")
        return False


def test_public_get_team():
    """Test 7: GET /api/team (public, should have 3 members: Hasan/Ali/Baris Savun)"""
    try:
        response = requests.get(f"{BASE_URL}/team", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) == 3:
                names = [m.get("name", "") for m in data]
                expected = ["Hasan Savun", "Ali Savun", "Barış Eren Savun"]
                if all(name in names for name in expected):
                    log_test("Public GET /team", True, f"Got 3 team members: {names}")
                    return True
                else:
                    log_test("Public GET /team", False, f"Expected {expected}, got {names}")
                    return False
            else:
                log_test("Public GET /team", False, f"Expected 3 members, got {len(data) if isinstance(data, list) else 'not a list'}")
                return False
        else:
            log_test("Public GET /team", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Public GET /team", False, f"Exception: {str(e)}")
        return False


def test_public_get_faqs():
    """Test 8: GET /api/faqs (public, should have 6 seeded FAQs)"""
    try:
        response = requests.get(f"{BASE_URL}/faqs", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) == 6:
                log_test("Public GET /faqs", True, f"Got 6 FAQs")
                return True
            else:
                log_test("Public GET /faqs", False, f"Expected 6 FAQs, got {len(data) if isinstance(data, list) else 'not a list'}")
                return False
        else:
            log_test("Public GET /faqs", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Public GET /faqs", False, f"Exception: {str(e)}")
        return False


def test_public_post_service_request():
    """Test 9: POST /api/service-requests (public, no auth required)"""
    try:
        payload = {
            "name": "Mehmet Yılmaz",
            "phone": "+90 555 444 33 22",
            "email": "mehmet@example.com",
            "subject": "Forklift Bakım Talebi",
            "message": "Forkliftimiz için periyodik bakım hizmeti almak istiyoruz."
        }
        response = requests.post(f"{BASE_URL}/service-requests", json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            required = ["id", "is_read", "created_at", "name", "phone", "message"]
            missing = [f for f in required if f not in data]
            if not missing and data.get("is_read") == False:
                log_test("Public POST /service-requests", True, f"Created request with id: {data['id']}")
                # Store the ID for later tests
                global created_request_id
                created_request_id = data["id"]
                return True
            else:
                log_test("Public POST /service-requests", False, f"Missing fields: {missing} or is_read not False")
                return False
        else:
            log_test("Public POST /service-requests", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Public POST /service-requests", False, f"Exception: {str(e)}")
        return False


def test_auth_protection_settings_put():
    """Test 10: PUT /api/settings without token (should return 401)"""
    try:
        response = requests.put(
            f"{BASE_URL}/settings",
            json={"brand": "Test", "phone": "123"},
            timeout=10
        )
        if response.status_code in [401, 403]:
            log_test("Auth Protection: PUT /settings (401/403)", True, f"Correctly rejected with {response.status_code}")
            return True
        else:
            log_test("Auth Protection: PUT /settings (401/403)", False, f"Expected 401/403, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Auth Protection: PUT /settings (401/403)", False, f"Exception: {str(e)}")
        return False


def test_auth_protection_services_post():
    """Test 11: POST /api/services without token (should return 401)"""
    try:
        response = requests.post(
            f"{BASE_URL}/services",
            json={"title_tr": "Test", "order": 99},
            timeout=10
        )
        if response.status_code in [401, 403]:
            log_test("Auth Protection: POST /services (401/403)", True, f"Correctly rejected with {response.status_code}")
            return True
        else:
            log_test("Auth Protection: POST /services (401/403)", False, f"Expected 401/403, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Auth Protection: POST /services (401/403)", False, f"Exception: {str(e)}")
        return False


def test_auth_protection_team_post():
    """Test 12: POST /api/team without token (should return 401)"""
    try:
        response = requests.post(
            f"{BASE_URL}/team",
            json={"name": "Test", "order": 99},
            timeout=10
        )
        if response.status_code in [401, 403]:
            log_test("Auth Protection: POST /team (401/403)", True, f"Correctly rejected with {response.status_code}")
            return True
        else:
            log_test("Auth Protection: POST /team (401/403)", False, f"Expected 401/403, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Auth Protection: POST /team (401/403)", False, f"Exception: {str(e)}")
        return False


def test_auth_protection_faqs_post():
    """Test 13: POST /api/faqs without token (should return 401)"""
    try:
        response = requests.post(
            f"{BASE_URL}/faqs",
            json={"q_tr": "Test?", "order": 99},
            timeout=10
        )
        if response.status_code in [401, 403]:
            log_test("Auth Protection: POST /faqs (401/403)", True, f"Correctly rejected with {response.status_code}")
            return True
        else:
            log_test("Auth Protection: POST /faqs (401/403)", False, f"Expected 401/403, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Auth Protection: POST /faqs (401/403)", False, f"Exception: {str(e)}")
        return False


def test_auth_protection_service_requests_get():
    """Test 14: GET /api/service-requests without token (should return 401)"""
    try:
        response = requests.get(f"{BASE_URL}/service-requests", timeout=10)
        if response.status_code in [401, 403]:
            log_test("Auth Protection: GET /service-requests (401/403)", True, f"Correctly rejected with {response.status_code}")
            return True
        else:
            log_test("Auth Protection: GET /service-requests (401/403)", False, f"Expected 401/403, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Auth Protection: GET /service-requests (401/403)", False, f"Exception: {str(e)}")
        return False


# CRUD with token tests
created_service_id = None
created_team_id = None
created_faq_id = None
created_request_id = None


def test_services_crud_with_token():
    """Test 15-17: Services CRUD with token (POST, PUT, DELETE)"""
    global created_service_id
    if not token:
        log_test("Services CRUD", False, "No token available")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # POST - Create
    try:
        payload = {
            "order": 99,
            "icon_key": "test",
            "title_tr": "Test Servis",
            "title_en": "Test Service",
            "desc_tr": "Test açıklama",
            "desc_en": "Test description"
        }
        response = requests.post(f"{BASE_URL}/services", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data.get("title_tr") == "Test Servis":
                created_service_id = data["id"]
                log_test("Services CRUD: POST create", True, f"Created service with id: {created_service_id}")
            else:
                log_test("Services CRUD: POST create", False, f"Missing id or wrong data: {data}")
                return False
        else:
            log_test("Services CRUD: POST create", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Services CRUD: POST create", False, f"Exception: {str(e)}")
        return False
    
    # PUT - Update
    try:
        payload = {
            "order": 100,
            "icon_key": "test",
            "title_tr": "Test Servis Güncellendi",
            "title_en": "Test Service Updated",
            "desc_tr": "Güncellenmiş açıklama",
            "desc_en": "Updated description"
        }
        response = requests.put(f"{BASE_URL}/services/{created_service_id}", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("title_tr") == "Test Servis Güncellendi":
                log_test("Services CRUD: PUT update", True, f"Updated service")
            else:
                log_test("Services CRUD: PUT update", False, f"Update failed: {data}")
                return False
        else:
            log_test("Services CRUD: PUT update", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Services CRUD: PUT update", False, f"Exception: {str(e)}")
        return False
    
    # DELETE
    try:
        response = requests.delete(f"{BASE_URL}/services/{created_service_id}", headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True:
                log_test("Services CRUD: DELETE", True, f"Deleted service")
                return True
            else:
                log_test("Services CRUD: DELETE", False, f"Delete failed: {data}")
                return False
        else:
            log_test("Services CRUD: DELETE", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Services CRUD: DELETE", False, f"Exception: {str(e)}")
        return False


def test_team_crud_with_token():
    """Test 18-20: Team CRUD with token (POST, PUT, DELETE)"""
    global created_team_id
    if not token:
        log_test("Team CRUD", False, "No token available")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # POST - Create
    try:
        payload = {
            "order": 99,
            "name": "Test Kişi",
            "title_tr": "Test Pozisyon",
            "title_en": "Test Position",
            "phone": "+90 555 999 99 99",
            "email": "test@svnmakina.com"
        }
        response = requests.post(f"{BASE_URL}/team", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data.get("name") == "Test Kişi":
                created_team_id = data["id"]
                log_test("Team CRUD: POST create", True, f"Created team member with id: {created_team_id}")
            else:
                log_test("Team CRUD: POST create", False, f"Missing id or wrong data: {data}")
                return False
        else:
            log_test("Team CRUD: POST create", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Team CRUD: POST create", False, f"Exception: {str(e)}")
        return False
    
    # PUT - Update
    try:
        payload = {
            "order": 100,
            "name": "Test Kişi Güncellendi",
            "title_tr": "Güncellenmiş Pozisyon",
            "title_en": "Updated Position",
            "phone": "+90 555 888 88 88",
            "email": "test.updated@svnmakina.com"
        }
        response = requests.put(f"{BASE_URL}/team/{created_team_id}", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("name") == "Test Kişi Güncellendi":
                log_test("Team CRUD: PUT update", True, f"Updated team member")
            else:
                log_test("Team CRUD: PUT update", False, f"Update failed: {data}")
                return False
        else:
            log_test("Team CRUD: PUT update", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Team CRUD: PUT update", False, f"Exception: {str(e)}")
        return False
    
    # DELETE
    try:
        response = requests.delete(f"{BASE_URL}/team/{created_team_id}", headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True:
                log_test("Team CRUD: DELETE", True, f"Deleted team member")
                return True
            else:
                log_test("Team CRUD: DELETE", False, f"Delete failed: {data}")
                return False
        else:
            log_test("Team CRUD: DELETE", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Team CRUD: DELETE", False, f"Exception: {str(e)}")
        return False


def test_faqs_crud_with_token():
    """Test 21-23: FAQs CRUD with token (POST, PUT, DELETE)"""
    global created_faq_id
    if not token:
        log_test("FAQs CRUD", False, "No token available")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # POST - Create
    try:
        payload = {
            "order": 99,
            "q_tr": "Test soru?",
            "q_en": "Test question?",
            "a_tr": "Test cevap",
            "a_en": "Test answer"
        }
        response = requests.post(f"{BASE_URL}/faqs", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data.get("q_tr") == "Test soru?":
                created_faq_id = data["id"]
                log_test("FAQs CRUD: POST create", True, f"Created FAQ with id: {created_faq_id}")
            else:
                log_test("FAQs CRUD: POST create", False, f"Missing id or wrong data: {data}")
                return False
        else:
            log_test("FAQs CRUD: POST create", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("FAQs CRUD: POST create", False, f"Exception: {str(e)}")
        return False
    
    # PUT - Update
    try:
        payload = {
            "order": 100,
            "q_tr": "Test soru güncellendi?",
            "q_en": "Test question updated?",
            "a_tr": "Güncellenmiş cevap",
            "a_en": "Updated answer"
        }
        response = requests.put(f"{BASE_URL}/faqs/{created_faq_id}", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("q_tr") == "Test soru güncellendi?":
                log_test("FAQs CRUD: PUT update", True, f"Updated FAQ")
            else:
                log_test("FAQs CRUD: PUT update", False, f"Update failed: {data}")
                return False
        else:
            log_test("FAQs CRUD: PUT update", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("FAQs CRUD: PUT update", False, f"Exception: {str(e)}")
        return False
    
    # DELETE
    try:
        response = requests.delete(f"{BASE_URL}/faqs/{created_faq_id}", headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True:
                log_test("FAQs CRUD: DELETE", True, f"Deleted FAQ")
                return True
            else:
                log_test("FAQs CRUD: DELETE", False, f"Delete failed: {data}")
                return False
        else:
            log_test("FAQs CRUD: DELETE", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("FAQs CRUD: DELETE", False, f"Exception: {str(e)}")
        return False


def test_settings_put_with_token():
    """Test 24: PUT /api/settings with token (update phone)"""
    if not token:
        log_test("Settings PUT with token", False, "No token available")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # First get current settings
        response = requests.get(f"{BASE_URL}/settings", timeout=10)
        if response.status_code != 200:
            log_test("Settings PUT with token", False, f"Failed to get current settings: {response.status_code}")
            return False
        
        current = response.json()
        
        # Update phone
        current["phone"] = "+90 555 TEST 123"
        response = requests.put(f"{BASE_URL}/settings", json=current, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("phone") == "+90 555 TEST 123":
                log_test("Settings PUT with token", True, f"Updated phone to: {data['phone']}")
                
                # Verify with GET
                response = requests.get(f"{BASE_URL}/settings", timeout=10)
                if response.status_code == 200:
                    verify = response.json()
                    if verify.get("phone") == "+90 555 TEST 123":
                        log_test("Settings PUT verification", True, "GET reflects the change")
                        return True
                    else:
                        log_test("Settings PUT verification", False, f"GET shows different phone: {verify.get('phone')}")
                        return False
                else:
                    log_test("Settings PUT verification", False, f"GET failed: {response.status_code}")
                    return False
            else:
                log_test("Settings PUT with token", False, f"Phone not updated: {data.get('phone')}")
                return False
        else:
            log_test("Settings PUT with token", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Settings PUT with token", False, f"Exception: {str(e)}")
        return False


def test_service_requests_with_token():
    """Test 25-27: Service Requests GET/PATCH/DELETE with token"""
    if not token:
        log_test("Service Requests with token", False, "No token available")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # GET - List (should include the one created in test 9)
    try:
        response = requests.get(f"{BASE_URL}/service-requests", headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                # Find our created request
                found = False
                for req in data:
                    if req.get("name") == "Mehmet Yılmaz":
                        found = True
                        global created_request_id
                        created_request_id = req.get("id")
                        break
                
                if found:
                    log_test("Service Requests: GET list", True, f"Found {len(data)} requests including our test request")
                else:
                    log_test("Service Requests: GET list", False, f"Test request not found in list of {len(data)} requests")
                    return False
            else:
                log_test("Service Requests: GET list", False, f"Expected list with items, got {data}")
                return False
        else:
            log_test("Service Requests: GET list", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Service Requests: GET list", False, f"Exception: {str(e)}")
        return False
    
    # PATCH - Mark as read
    if not created_request_id:
        log_test("Service Requests: PATCH mark read", False, "No request ID available")
        return False
    
    try:
        response = requests.patch(f"{BASE_URL}/service-requests/{created_request_id}", headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("is_read") == True:
                log_test("Service Requests: PATCH mark read", True, f"Marked request as read")
            else:
                log_test("Service Requests: PATCH mark read", False, f"is_read not True: {data}")
                return False
        else:
            log_test("Service Requests: PATCH mark read", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Service Requests: PATCH mark read", False, f"Exception: {str(e)}")
        return False
    
    # DELETE
    try:
        response = requests.delete(f"{BASE_URL}/service-requests/{created_request_id}", headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True:
                log_test("Service Requests: DELETE", True, f"Deleted request")
                return True
            else:
                log_test("Service Requests: DELETE", False, f"Delete failed: {data}")
                return False
        else:
            log_test("Service Requests: DELETE", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Service Requests: DELETE", False, f"Exception: {str(e)}")
        return False


def test_change_password_without_token():
    """Test 28: POST /api/auth/change-password without token (should return 401)"""
    try:
        payload = {
            "current_password": "admin123",
            "new_password": "newpass123"
        }
        response = requests.post(f"{BASE_URL}/auth/change-password", json=payload, timeout=10)
        if response.status_code in [401, 403]:
            log_test("Change Password: without token (401)", True, f"Correctly rejected with {response.status_code}")
            return True
        else:
            log_test("Change Password: without token (401)", False, f"Expected 401/403, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Change Password: without token (401)", False, f"Exception: {str(e)}")
        return False


def test_change_password_wrong_current():
    """Test 29: POST /api/auth/change-password with wrong current password (should return 400)"""
    if not token:
        log_test("Change Password: wrong current (400)", False, "No token available")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        payload = {
            "current_password": "wrongpassword",
            "new_password": "newpass123"
        }
        response = requests.post(f"{BASE_URL}/auth/change-password", json=payload, headers=headers, timeout=10)
        if response.status_code == 400:
            log_test("Change Password: wrong current (400)", True, "Correctly rejected wrong current password")
            return True
        else:
            log_test("Change Password: wrong current (400)", False, f"Expected 400, got {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Change Password: wrong current (400)", False, f"Exception: {str(e)}")
        return False


def test_change_password_flow():
    """Test 30-33: Change password flow (change to newpass123, verify old fails, new works, change back to admin123)"""
    global token
    if not token:
        log_test("Change Password Flow", False, "No token available")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Step 1: Change password from admin123 to newpass123
    try:
        payload = {
            "current_password": "admin123",
            "new_password": "newpass123"
        }
        response = requests.post(f"{BASE_URL}/auth/change-password", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True:
                log_test("Change Password: change to newpass123", True, "Password changed successfully")
            else:
                log_test("Change Password: change to newpass123", False, f"Unexpected response: {data}")
                return False
        else:
            log_test("Change Password: change to newpass123", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Change Password: change to newpass123", False, f"Exception: {str(e)}")
        return False
    
    # Step 2: Verify login with old password (admin123) now FAILS
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": "admin", "password": "admin123"},
            timeout=10
        )
        if response.status_code == 401:
            log_test("Change Password: old password fails (401)", True, "Old password correctly rejected")
        else:
            log_test("Change Password: old password fails (401)", False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Change Password: old password fails (401)", False, f"Exception: {str(e)}")
        return False
    
    # Step 3: Verify login with new password (newpass123) SUCCEEDS
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": "admin", "password": "newpass123"},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                new_token = data["access_token"]
                log_test("Change Password: new password works", True, f"Login with newpass123 successful")
                token = new_token  # Update global token
            else:
                log_test("Change Password: new password works", False, f"Missing access_token: {data}")
                return False
        else:
            log_test("Change Password: new password works", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Change Password: new password works", False, f"Exception: {str(e)}")
        return False
    
    # Step 4: Change password BACK to admin123 (IMPORTANT for cleanup)
    headers = {"Authorization": f"Bearer {token}"}
    try:
        payload = {
            "current_password": "newpass123",
            "new_password": "admin123"
        }
        response = requests.post(f"{BASE_URL}/auth/change-password", json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True:
                log_test("Change Password: restore to admin123", True, "Password restored to admin123")
            else:
                log_test("Change Password: restore to admin123", False, f"Unexpected response: {data}")
                return False
        else:
            log_test("Change Password: restore to admin123", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Change Password: restore to admin123", False, f"Exception: {str(e)}")
        return False
    
    # Step 5: Verify login with admin123 works again
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": "admin", "password": "admin123"},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                token = data["access_token"]  # Update global token
                log_test("Change Password: verify admin123 works", True, "Final verification: admin123 login successful")
                return True
            else:
                log_test("Change Password: verify admin123 works", False, f"Missing access_token: {data}")
                return False
        else:
            log_test("Change Password: verify admin123 works", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Change Password: verify admin123 works", False, f"Exception: {str(e)}")
        return False


def test_settings_extended_fields():
    """Test 34: GET /api/settings includes all new extended fields"""
    try:
        response = requests.get(f"{BASE_URL}/settings", timeout=10)
        if response.status_code == 200:
            data = response.json()
            
            # Check for all new extended fields
            new_fields = [
                "hero_image", "about_image",
                "hero_tagline_tr", "hero_tagline_en",
                "about_title_tr", "about_title_en",
                "services_title_tr", "services_title_en",
                "faq_title_tr", "faq_title_en",
                "feature1_title_tr", "feature1_title_en",
                "feature1_desc_tr", "feature1_desc_en",
                "feature2_title_tr", "feature2_title_en",
                "feature2_desc_tr", "feature2_desc_en",
                "feature3_title_tr", "feature3_title_en",
                "feature3_desc_tr", "feature3_desc_en",
                "footer_about_tr", "footer_about_en",
                "maintenance_mode", "maintenance_msg_tr", "maintenance_msg_en"
            ]
            
            missing = [f for f in new_fields if f not in data]
            
            if not missing:
                log_test("Settings Extended Fields: GET includes all new fields", True, f"All {len(new_fields)} new fields present")
                return True
            else:
                log_test("Settings Extended Fields: GET includes all new fields", False, f"Missing fields: {missing}")
                return False
        else:
            log_test("Settings Extended Fields: GET includes all new fields", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test("Settings Extended Fields: GET includes all new fields", False, f"Exception: {str(e)}")
        return False


def test_settings_maintenance_mode():
    """Test 35-36: PUT /api/settings with maintenance_mode toggle"""
    if not token:
        log_test("Settings Maintenance Mode", False, "No token available")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Step 1: Get current settings
    try:
        response = requests.get(f"{BASE_URL}/settings", timeout=10)
        if response.status_code != 200:
            log_test("Settings Maintenance Mode: GET current", False, f"Failed to get settings: {response.status_code}")
            return False
        
        current = response.json()
        original_feature1_title_tr = current.get("feature1_title_tr", "")
        
        # Step 2: Set maintenance_mode=true and change feature1_title_tr
        current["maintenance_mode"] = True
        current["feature1_title_tr"] = "TEST FEATURE TITLE"
        
        response = requests.put(f"{BASE_URL}/settings", json=current, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("maintenance_mode") == True and data.get("feature1_title_tr") == "TEST FEATURE TITLE":
                log_test("Settings Maintenance Mode: set to true", True, "maintenance_mode=true and feature1_title_tr updated")
            else:
                log_test("Settings Maintenance Mode: set to true", False, f"Values not updated correctly: maintenance_mode={data.get('maintenance_mode')}, feature1_title_tr={data.get('feature1_title_tr')}")
                return False
        else:
            log_test("Settings Maintenance Mode: set to true", False, f"Status {response.status_code}: {response.text}")
            return False
        
        # Step 3: Verify GET reflects the changes
        response = requests.get(f"{BASE_URL}/settings", timeout=10)
        if response.status_code == 200:
            verify = response.json()
            if verify.get("maintenance_mode") == True and verify.get("feature1_title_tr") == "TEST FEATURE TITLE":
                log_test("Settings Maintenance Mode: verify GET reflects changes", True, "GET shows maintenance_mode=true and updated feature1_title_tr")
            else:
                log_test("Settings Maintenance Mode: verify GET reflects changes", False, f"GET doesn't reflect changes: {verify.get('maintenance_mode')}, {verify.get('feature1_title_tr')}")
                return False
        else:
            log_test("Settings Maintenance Mode: verify GET reflects changes", False, f"GET failed: {response.status_code}")
            return False
        
        # Step 4: Reset maintenance_mode=false and restore feature1_title_tr (IMPORTANT for cleanup)
        current["maintenance_mode"] = False
        current["feature1_title_tr"] = "Uzman Kadro"  # Restore to original
        
        response = requests.put(f"{BASE_URL}/settings", json=current, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("maintenance_mode") == False and data.get("feature1_title_tr") == "Uzman Kadro":
                log_test("Settings Maintenance Mode: reset to false", True, "maintenance_mode=false and feature1_title_tr restored")
            else:
                log_test("Settings Maintenance Mode: reset to false", False, f"Reset failed: maintenance_mode={data.get('maintenance_mode')}, feature1_title_tr={data.get('feature1_title_tr')}")
                return False
        else:
            log_test("Settings Maintenance Mode: reset to false", False, f"Status {response.status_code}: {response.text}")
            return False
        
        # Step 5: Final verification
        response = requests.get(f"{BASE_URL}/settings", timeout=10)
        if response.status_code == 200:
            final = response.json()
            if final.get("maintenance_mode") == False:
                log_test("Settings Maintenance Mode: final verification", True, "Final state: maintenance_mode=false")
                return True
            else:
                log_test("Settings Maintenance Mode: final verification", False, f"Final maintenance_mode={final.get('maintenance_mode')}")
                return False
        else:
            log_test("Settings Maintenance Mode: final verification", False, f"Final GET failed: {response.status_code}")
            return False
        
    except Exception as e:
        log_test("Settings Maintenance Mode", False, f"Exception: {str(e)}")
        return False


def main():
    """Run all tests"""
    print("=" * 80)
    print("SVN Makina Backend API Test Suite")
    print(f"Testing: {BASE_URL}")
    print("=" * 80)
    print()
    
    # Run tests in order
    test_auth_login_success()
    test_auth_login_failure()
    test_auth_me_with_token()
    test_auth_me_without_token()
    test_public_get_settings()
    test_public_get_services()
    test_public_get_team()
    test_public_get_faqs()
    test_public_post_service_request()
    test_auth_protection_settings_put()
    test_auth_protection_services_post()
    test_auth_protection_team_post()
    test_auth_protection_faqs_post()
    test_auth_protection_service_requests_get()
    test_services_crud_with_token()
    test_team_crud_with_token()
    test_faqs_crud_with_token()
    test_settings_put_with_token()
    test_service_requests_with_token()
    
    # NEW TESTS for change password and settings extended fields
    print()
    print("=" * 80)
    print("TESTING NEW FEATURES")
    print("=" * 80)
    print()
    test_change_password_without_token()
    test_change_password_wrong_current()
    test_change_password_flow()
    test_settings_extended_fields()
    test_settings_maintenance_mode()
    
    # Summary
    print()
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    passed = sum(1 for t in test_results if t["passed"])
    failed = sum(1 for t in test_results if not t["passed"])
    total = len(test_results)
    
    print(f"Total: {total} | Passed: {passed} | Failed: {failed}")
    print()
    
    if failed > 0:
        print("FAILED TESTS:")
        for t in test_results:
            if not t["passed"]:
                print(f"  ❌ {t['name']}")
                if t["details"]:
                    print(f"     {t['details']}")
        print()
        sys.exit(1)
    else:
        print("✅ ALL TESTS PASSED!")
        sys.exit(0)


if __name__ == "__main__":
    main()
