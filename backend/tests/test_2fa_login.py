import requests

base_url = "http://127.0.0.1:5000/api"

# Step 1: Log in
login_data = {
    "username": "testuser2",
    "password": "testpassword"
}
session = requests.Session()
login_response = session.post(f"{base_url}/login", json=login_data)
print("Login Response:", login_response.json())

# Step 2: Validate 2FA
validate_data = {
    "username": "testuser2",
    "code": "100089"
}
validate_response = session.post(f"{base_url}/validate-2fa", json=validate_data)
print("2FA Validation Response:", validate_response.json())
