from flask import Blueprint, request, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from database.user_functions import create_user, read_user
from database.models import User as UserModel
from endpoints.database import save_palette, get_palettes
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import json
import random
import re

# Flask Blueprint
auth_bp = Blueprint('auth', __name__)

# Initialize Flask-Login
login_manager = LoginManager()

# Database connection setup
DATABASE_URL = "mysql+pymysql://Your_Username123:Your_Password123@localhost/color_variant_db"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

# User model for Flask-Login
class User(UserMixin):
    def __init__(self, id, username, password_hash, email):
        self.id = id
        self.username = username
        self.password_hash = password_hash
        self.email = email

    @staticmethod
    def get_user_by_username(username):
        session = Session()
        try:
            user = session.query(UserModel).filter_by(username=username).first()
            if user:
                return User(user.id, user.username, user.password_hash, user.email)
            return None
        finally:
            session.close()

# Flask-Login user loader
@login_manager.user_loader
def load_user(user_id):
    session = Session()
    try:
        user = session.query(UserModel).filter_by(id=user_id).first()
        if user:
            return User(user.id, user.username, user.password_hash, user.email)
        return None
    finally:
        session.close()

# Register endpoint
@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    session = Session()
    try:
        if session.query(UserModel).filter_by(username=username).first():
            return jsonify({'error': 'Username is already taken'}), 409

        if email and not is_valid_email(email):
            return jsonify({'error': 'Invalid email address'}), 400

        # Create user with confirmation code if email provided
        confirmation_code = None
        if email:
            confirmation_code = f"{random.randint(100000, 999999)}"
            body = f"Hello,\n\nYour confirmation code is: {confirmation_code}\n\nThank you!"
            # send_email(email, subject, body) # Assume this works

        password_hash = generate_password_hash(password)
        new_user = create_user(session, username=username, password_hash=password_hash, email=email, confirmation_code=confirmation_code)
        session.commit()

        if email:
            return jsonify({'message': 'Registration successful. Email will be validated'}), 201

        return jsonify({'message': 'User registered successfully. No email provided.', 'username': new_user.username, 'id': new_user.id}), 201
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    user = User.get_user_by_username(username)
    if user and check_password_hash(user.password_hash, password):
        login_user(user)
        return jsonify({'message': 'Login successful', 'username': user.username, 'id': user.id}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


@auth_bp.route('/api/logout', methods=['POST'])
@login_required
def logout():
    try:
        logout_user()
        return jsonify({'message': 'Logout successful'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/api/save_palette', methods=['POST'])
@login_required
def save_palette_route():
    data = request.json
    palette_data = data.get('palette_data')

    if not palette_data:
        return jsonify({'error': 'Palette data is missing'}), 400

    try:
        save_palette(current_user.id, palette_data)
        return jsonify({'message': 'Palette saved successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/get_palettes/<int:user_id>', methods=['GET'])
def get_palettes_route(user_id):
    result = get_palettes(user_id)
    if result is None:
        return jsonify({'error': 'User not found'}), 404

    palettes, username = result
    return jsonify({'palettes': palettes, 'username': username}), 200

# Utility: Validate email
def is_valid_email(email):
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email) is not None
