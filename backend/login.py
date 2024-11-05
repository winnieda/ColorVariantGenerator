from flask import Blueprint, request, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
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
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = data['password']
    email = data.get('email')  # This will be None if email is not provided

    if User.get_user_by_username(username):
        return jsonify({'error': 'User already exists'}), 409

    password_hash = generate_password_hash(password)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO User (username, password_hash, email) VALUES (%s, %s, %s)",
        (username, password_hash, email)
    )
    conn.commit()
    conn.close()

    return jsonify({'message': 'User registered successfully'}), 201

# Login endpoint
@auth_bp.route('/login', methods=['POST'])
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
@auth_bp.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

# Save Palette Endpoint
@auth_bp.route('/save_palette', methods=['POST'])
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
@auth_bp.route('/get_palettes/<int:user_id>', methods=['GET'])
def get_palettes_route(user_id):
    result = get_palettes(user_id)
    if result is None:
        return jsonify({'error': 'User not found'}), 404
    
    palettes, username = result
    return jsonify({'palettes': palettes, 'username': username}), 200