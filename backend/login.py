from flask import Blueprint, request, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db_connection, save_palette, get_palettes 

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
    email = data['email']

    if User.get_user_by_username(username):
        return jsonify({'error': 'User already exists'}), 409

    password_hash = generate_password_hash(password)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO User (username, password_hash, email) VALUES (%s, %s, %s)",
                   (username, password_hash, email))
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
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# Logout endpoint
@auth_bp.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

# Save Palette Endpoint
@auth_bp.route('/save_palette', methods=['POST'])
@login_required
def save_palette_route():
    data = request.json
    palette_data = data.get('palette_data')  # Expecting this to be a JSON-like structure

    if not palette_data:
        return jsonify({'error': 'Palette data is required'}), 400

    # Save the palette for the current user
    save_palette(current_user.id, palette_data)
    return jsonify({'message': 'Palette saved successfully'}), 201

# Get Palettes Endpoint
@auth_bp.route('/get_palettes', methods=['GET'])
@login_required
def get_palettes_route():
    # Retrieve palettes for the current user
    palettes = get_palettes(current_user.id)
    return jsonify(palettes), 200