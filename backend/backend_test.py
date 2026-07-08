"""
Comprehensive Backend API Testing for Portal Arsip Digital Inspektorat.
Tests all endpoints, RBAC, authentication, and CRUD operations.
"""
import requests
import sys
from datetime import datetime

BASE_URL = "https://arsip-hub.preview.emergentagent.com/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

class APITester:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.tests_failed = 0
        self.admin_token = None
        self.auditor_token = None
        self.created_user_id = None
        self.created_news_id = None

    def log(self, msg, color=Colors.RESET):
        print(f"{color}{msg}{Colors.RESET}")

    def test(self, name, method, endpoint, expected_status, data=None, token=None, expect_fail=False):
        """Run a single API test"""
        url = f"{BASE_URL}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = f'Bearer {token}'

        self.tests_run += 1
        print(f"\n{'='*60}")
        self.log(f"🔍 Test #{self.tests_run}: {name}", Colors.BLUE)
        self.log(f"   {method} {endpoint}", Colors.BLUE)
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                self.log(f"✅ PASSED - Status: {response.status_code}", Colors.GREEN)
                if response.text:
                    try:
                        return True, response.json()
                    except:
                        return True, {}
                return True, {}
            else:
                self.tests_failed += 1
                self.log(f"❌ FAILED - Expected {expected_status}, got {response.status_code}", Colors.RED)
                try:
                    error_detail = response.json()
                    self.log(f"   Error: {error_detail}", Colors.RED)
                except:
                    self.log(f"   Response: {response.text[:200]}", Colors.RED)
                return False, {}

        except Exception as e:
            self.tests_failed += 1
            self.log(f"❌ FAILED - Exception: {str(e)}", Colors.RED)
            return False, {}

    def run_all_tests(self):
        """Execute all test scenarios"""
        self.log("\n" + "="*60, Colors.YELLOW)
        self.log("🚀 Starting Backend API Tests", Colors.YELLOW)
        self.log("="*60 + "\n", Colors.YELLOW)

        # 1. Health Check
        self.log("\n📋 SECTION 1: Health & Basic Endpoints", Colors.YELLOW)
        self.test("Health check", "GET", "/health", 200)
        self.test("Root endpoint", "GET", "/", 200)

        # 2. Authentication Tests
        self.log("\n📋 SECTION 2: Authentication", Colors.YELLOW)
        
        # Admin login
        success, response = self.test(
            "Admin login (valid credentials)",
            "POST", "/auth/login", 200,
            data={"username": "admin", "password": "Admin@2025"}
        )
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            self.log(f"   ✓ Admin token obtained", Colors.GREEN)
        else:
            self.log(f"   ✗ Failed to get admin token - stopping tests", Colors.RED)
            return self.print_summary()

        # Auditor login
        success, response = self.test(
            "Auditor login (valid credentials)",
            "POST", "/auth/login", 200,
            data={"username": "auditor", "password": "Auditor@2025"}
        )
        if success and 'access_token' in response:
            self.auditor_token = response['access_token']
            self.log(f"   ✓ Auditor token obtained", Colors.GREEN)
        else:
            self.log(f"   ✗ Failed to get auditor token", Colors.RED)

        # Wrong credentials
        self.test(
            "Login with wrong password",
            "POST", "/auth/login", 401,
            data={"username": "admin", "password": "wrongpassword"}
        )

        self.test(
            "Login with non-existent user",
            "POST", "/auth/login", 401,
            data={"username": "nonexistent", "password": "password"}
        )

        # 3. Auth/me endpoint
        self.log("\n📋 SECTION 3: Get Current User", Colors.YELLOW)
        
        self.test(
            "GET /auth/me with admin token",
            "GET", "/auth/me", 200,
            token=self.admin_token
        )

        self.test(
            "GET /auth/me with auditor token",
            "GET", "/auth/me", 200,
            token=self.auditor_token
        )

        self.test(
            "GET /auth/me without token",
            "GET", "/auth/me", 401
        )

        # 4. Users Management (Admin only)
        self.log("\n📋 SECTION 4: Users Management (Admin Only)", Colors.YELLOW)
        
        # List users - admin
        self.test(
            "GET /users (admin)",
            "GET", "/users", 200,
            token=self.admin_token
        )

        # List users - auditor (should fail)
        self.test(
            "GET /users (auditor - should fail 403)",
            "GET", "/users", 403,
            token=self.auditor_token
        )

        # Create user - admin
        success, response = self.test(
            "POST /users (admin creates new user)",
            "POST", "/users", 200,
            data={
                "username": f"testuser_{datetime.now().strftime('%H%M%S')}",
                "full_name": "Test User",
                "password": "TestPass123!",
                "role": "auditor"
            },
            token=self.admin_token
        )
        if success and 'id' in response:
            self.created_user_id = response['id']
            self.log(f"   ✓ Created user ID: {self.created_user_id}", Colors.GREEN)

        # Create user - auditor (should fail)
        self.test(
            "POST /users (auditor - should fail 403)",
            "POST", "/users", 403,
            data={
                "username": f"testuser2_{datetime.now().strftime('%H%M%S')}",
                "full_name": "Test User 2",
                "password": "TestPass123!",
                "role": "auditor"
            },
            token=self.auditor_token
        )

        # Duplicate username
        self.test(
            "POST /users (duplicate username - should fail 400)",
            "POST", "/users", 400,
            data={
                "username": "admin",
                "full_name": "Duplicate Admin",
                "password": "TestPass123!",
                "role": "admin"
            },
            token=self.admin_token
        )

        # Update user
        if self.created_user_id:
            self.test(
                "PATCH /users/{id} (admin updates user)",
                "PATCH", f"/users/{self.created_user_id}", 200,
                data={"full_name": "Updated Test User"},
                token=self.admin_token
            )

            # Auditor tries to update (should fail)
            self.test(
                "PATCH /users/{id} (auditor - should fail 403)",
                "PATCH", f"/users/{self.created_user_id}", 403,
                data={"full_name": "Hacked Name"},
                token=self.auditor_token
            )

            # Reset password
            self.test(
                "POST /users/{id}/reset-password (admin)",
                "POST", f"/users/{self.created_user_id}/reset-password", 200,
                data={"new_password": "NewPass123!"},
                token=self.admin_token
            )

        # Admin cannot deactivate themselves
        success, admin_me = self.test(
            "GET /auth/me to get admin ID",
            "GET", "/auth/me", 200,
            token=self.admin_token
        )
        if success and 'id' in admin_me:
            admin_id = admin_me['id']
            self.test(
                "PATCH /users/{id} (admin tries to deactivate self - should fail 400)",
                "PATCH", f"/users/{admin_id}", 400,
                data={"is_active": False},
                token=self.admin_token
            )

            self.test(
                "PATCH /users/{id} (admin tries to change own role - should fail 400)",
                "PATCH", f"/users/{admin_id}", 400,
                data={"role": "auditor"},
                token=self.admin_token
            )

            self.test(
                "DELETE /users/{id} (admin tries to delete self - should fail 400)",
                "DELETE", f"/users/{admin_id}", 400,
                token=self.admin_token
            )

        # 5. Change Password
        self.log("\n📋 SECTION 5: Change Password", Colors.YELLOW)
        
        self.test(
            "POST /auth/change-password (wrong old password)",
            "POST", "/auth/change-password", 400,
            data={"old_password": "wrongold", "new_password": "NewPass123!"},
            token=self.admin_token
        )

        # Note: We won't actually change admin password to avoid breaking subsequent tests

        # 6. News Management
        self.log("\n📋 SECTION 6: News Management", Colors.YELLOW)
        
        # List news - admin
        self.test(
            "GET /news (admin)",
            "GET", "/news", 200,
            token=self.admin_token
        )

        # List news - auditor (should work)
        self.test(
            "GET /news (auditor - should work)",
            "GET", "/news", 200,
            token=self.auditor_token
        )

        # Create news - admin
        success, response = self.test(
            "POST /news (admin creates news)",
            "POST", "/news", 200,
            data={
                "title": f"Test News {datetime.now().strftime('%H:%M:%S')}",
                "content": "This is a test news article created by automated testing.",
                "category": "Testing",
                "is_published": True
            },
            token=self.admin_token
        )
        if success and 'id' in response:
            self.created_news_id = response['id']
            self.log(f"   ✓ Created news ID: {self.created_news_id}", Colors.GREEN)

        # Create news - auditor (should fail)
        self.test(
            "POST /news (auditor - should fail 403)",
            "POST", "/news", 403,
            data={
                "title": "Unauthorized News",
                "content": "This should not be created.",
                "category": "Testing",
                "is_published": True
            },
            token=self.auditor_token
        )

        # Update news
        if self.created_news_id:
            self.test(
                "PATCH /news/{id} (admin updates news)",
                "PATCH", f"/news/{self.created_news_id}", 200,
                data={
                    "title": "Updated Test News",
                    "content": "Updated content",
                    "category": "Testing",
                    "is_published": False
                },
                token=self.admin_token
            )

            # Get single news
            self.test(
                "GET /news/{id} (admin)",
                "GET", f"/news/{self.created_news_id}", 200,
                token=self.admin_token
            )

            # Auditor tries to update (should fail)
            self.test(
                "PATCH /news/{id} (auditor - should fail 403)",
                "PATCH", f"/news/{self.created_news_id}", 403,
                data={"title": "Hacked Title"},
                token=self.auditor_token
            )

        # 7. Stats Management
        self.log("\n📋 SECTION 7: Stats Management", Colors.YELLOW)
        
        # Get stats - admin
        self.test(
            "GET /stats (admin)",
            "GET", "/stats", 200,
            token=self.admin_token
        )

        # Get stats - auditor (should work)
        self.test(
            "GET /stats (auditor - should work)",
            "GET", "/stats", 200,
            token=self.auditor_token
        )

        # Update stats - admin
        self.test(
            "PUT /stats (admin updates stats)",
            "PUT", "/stats", 200,
            data={
                "total_surat_masuk": 100,
                "total_surat_keluar": 80,
                "total_arsip": 500,
                "total_auditor_aktif": 5
            },
            token=self.admin_token
        )

        # Update stats - auditor (should fail)
        self.test(
            "PUT /stats (auditor - should fail 403)",
            "PUT", "/stats", 403,
            data={
                "total_surat_masuk": 999,
                "total_surat_keluar": 999,
                "total_arsip": 999,
                "total_auditor_aktif": 999
            },
            token=self.auditor_token
        )

        # 8. Links Management
        self.log("\n📋 SECTION 8: Links Management", Colors.YELLOW)
        
        # Get links - admin
        self.test(
            "GET /links (admin)",
            "GET", "/links", 200,
            token=self.admin_token
        )

        # Get links - auditor (should work)
        self.test(
            "GET /links (auditor - should work)",
            "GET", "/links", 200,
            token=self.auditor_token
        )

        # Update links - admin
        self.test(
            "PUT /links (admin updates links)",
            "PUT", "/links", 200,
            data={
                "irban_1": "https://irban1.arsipdigital-inspektorat.com",
                "irban_2": "",
                "irban_3": "",
                "irban_4": "https://irban4.arsipdigital-inspektorat.com",
                "irban_5": "",
                "kka": "https://kka.arsipdigital-inspektorat.com"
            },
            token=self.admin_token
        )

        # Update links - auditor (should fail)
        self.test(
            "PUT /links (auditor - should fail 403)",
            "PUT", "/links", 403,
            data={
                "irban_1": "https://hacked.com",
                "irban_2": "",
                "irban_3": "",
                "irban_4": "",
                "irban_5": "",
                "kka": ""
            },
            token=self.auditor_token
        )

        # 9. Cleanup - Delete created resources
        self.log("\n📋 SECTION 9: Cleanup", Colors.YELLOW)
        
        if self.created_news_id:
            self.test(
                "DELETE /news/{id} (admin deletes test news)",
                "DELETE", f"/news/{self.created_news_id}", 200,
                token=self.admin_token
            )

            # Auditor tries to delete (should fail)
            self.test(
                "DELETE /news/{id} (auditor - should fail 403)",
                "DELETE", f"/news/{self.created_news_id}", 403,
                token=self.auditor_token
            )

        if self.created_user_id:
            self.test(
                "DELETE /users/{id} (admin deletes test user)",
                "DELETE", f"/users/{self.created_user_id}", 200,
                token=self.admin_token
            )

        # 10. Test without token
        self.log("\n📋 SECTION 10: Unauthorized Access (No Token)", Colors.YELLOW)
        
        self.test(
            "GET /users (no token - should fail 401)",
            "GET", "/users", 401
        )

        self.test(
            "GET /news (no token - should fail 401)",
            "GET", "/news", 401
        )

        self.test(
            "GET /stats (no token - should fail 401)",
            "GET", "/stats", 401
        )

        self.test(
            "GET /links (no token - should fail 401)",
            "GET", "/links", 401
        )

        return self.print_summary()

    def print_summary(self):
        """Print test summary"""
        self.log("\n" + "="*60, Colors.YELLOW)
        self.log("📊 TEST SUMMARY", Colors.YELLOW)
        self.log("="*60, Colors.YELLOW)
        self.log(f"Total Tests Run: {self.tests_run}", Colors.BLUE)
        self.log(f"Passed: {self.tests_passed}", Colors.GREEN)
        self.log(f"Failed: {self.tests_failed}", Colors.RED)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        self.log(f"Success Rate: {success_rate:.1f}%", Colors.BLUE)
        
        if self.tests_failed == 0:
            self.log("\n🎉 All tests passed!", Colors.GREEN)
            return 0
        else:
            self.log(f"\n⚠️  {self.tests_failed} test(s) failed", Colors.RED)
            return 1

def main():
    tester = APITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())
