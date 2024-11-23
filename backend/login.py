from flask import Blueprint, request, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
import mysql
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db_connection, save_palette, get_palettes 
import json

# Define the blueprint
auth_bp = Blueprint('auth', __name__)

# Initialize Flask-Login
login_manager = LoginManager()

# User model
class User(UserMixin):
    def __init__(self, id, username, password_hash, email):
        self.id = id
        self.username = username
        self.password_hash = password_hash
        self.email = email

    @staticmethod
    def get_user_by_username(username):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, username, password_hash, email FROM User WHERE username = %s", (username,))
        user_data = cursor.fetchone()
        conn.close()
        if user_data:
            return User(*user_data)
        return None

# Required by Flask-Login to load a user from session
@login_manager.user_loader
def load_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, password_hash, email FROM User WHERE id = %s", (user_id,))
    user_data = cursor.fetchone()
    conn.close()
    if user_data:
        return User(*user_data)
    return None

# Register endpoint
@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')  # May be `None`

    # Ensure username and password are present
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    # Check if the username is already taken
    if User.get_user_by_username(username):
        return jsonify({'error': 'Username is already taken'}), 409

    # Validate email if provided
    if email:
        if not is_valid_email(email):
            return jsonify({'error': 'Invalid email address'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if the email already exists in the database
        cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
        existing_email = cursor.fetchone()
        conn.close()
        
        if existing_email:
            return jsonify({'error': 'Email is already registered'}), 409

        # Send confirmation email here in the next implementation step
        return jsonify({
            'message': 'Email will be validated. Please check your email for a confirmation link.'
        }), 200

    # If no email is provided, proceed to create the user
    password_hash = generate_password_hash(password)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO User (username, password_hash, email) VALUES (%s, %s, %s)",
            (username, password_hash, email)
        )
        conn.commit()
        conn.close()
    except mysql.connector.errors.IntegrityError as e:
        if "Duplicate entry" in str(e):
            if "User.email" in str(e):
                return jsonify({'error': 'Email is already registered'}), 409
            if "User.username" in str(e):
                return jsonify({'error': 'Username is already taken'}), 409
        raise


    user = User.get_user_by_username(username)

    return jsonify({
        'message': 'User registered successfully. No email provided.',
        'username': username,
        'id': user.id
    }), 201


# Add a basic email validation function
import re

def is_valid_email(email):
    # Simple regex for email validation
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email) is not None

# Login endpoint
@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    user = User.get_user_by_username(username)
    if user and check_password_hash(user.password_hash, password):
        login_user(user)
        # Return the username so frontend knows what username is
        return jsonify({'message': 'Login successful', 'username': username, 'id': user.id}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
    
# Logout endpoint
@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

# Save Palette Endpoint
@auth_bp.route('/api/save_palette', methods=['POST'])
@login_required
def save_palette():
    data = request.json
    palette_data = data.get('palette_data')

    # Example logic to store palette in the database
    if not palette_data:
        return jsonify({'error': 'Palette data is missing'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO Palettes (user_id, palette_data) VALUES (%s, %s)",
            (current_user.id, json.dumps(palette_data))
        )
        conn.commit()
        conn.close()

        return jsonify({'message': 'Palette saved successfully'}), 201
    except Exception as e:
        print(e)
        return jsonify({'error': 'Failed to save palette'}), 500

# Get Palettes Endpoint
@auth_bp.route('/api/get_palettes/<int:user_id>', methods=['GET'])
def get_palettes_route(user_id):
    result = get_palettes(user_id)
    if result is None:
        return jsonify({'error': 'User not found'}), 404
    
    palettes, username = result
    return jsonify({'palettes': palettes, 'username': username}), 200