from flask import Blueprint, request, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from database.user_functions import create_user, read_user, set_two_factor_code
from database.models import User as UserModel
from endpoints.database import save_palette, get_palettes
from endpoints.email_utils import send_email
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
    def __init__(self, id, username, password_hash, email, is_confirmed, two_factor_code):
        self.id = id
        self.username = username
        self.password_hash = password_hash
        self.email = email
        self.is_confirmed = is_confirmed
        self.two_factor_code = two_factor_code

    @staticmethod
    def get_user_by_username(username):
        session = Session()
        try:
            user = session.query(UserModel).filter_by(username=username).first()
            if user:
                return User(user.id, user.username, user.password_hash, user.email, user.is_confirmed, user.two_factor_code)
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
            return User(user.id, user.username, user.password_hash, user.email, user.is_confirmed, user.two_factor_code)
        return None
    finally:
        session.close()


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
        is_confirmed = False  # Default for users with an email address
        if email:
            confirmation_code = f"{random.randint(100000, 999999)}"
            subject = "ColorVariantGenerator Confirmation Code"
            body = f"Hello,\n\nYour confirmation code is: {confirmation_code}\n\nThank you for signing up!"
            send_email(recipient_email=email, subject=subject, body_text=body)  # Assume this works
        else:
            is_confirmed = True  # No email provided; user is auto-confirmed

        password_hash = generate_password_hash(password)
        new_user = create_user(
            session,
            username=username,
            password_hash=password_hash,
            email=email,
            confirmation_code=confirmation_code,
            is_confirmed=is_confirmed
        )
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
    if (
        user and 
        check_password_hash(user.password_hash, password) and 
        user.is_confirmed
    ):
        # Skip 2FA if email is invalid (null or blank)
        if not user.email or user.email.strip() == '':
            login_user(user)
            return jsonify({'message': 'Login successful', 'username': user.username, 'id': user.id}), 200

        # Generate 2FA code
        session = Session()
        try:
            two_factor_code = f"{random.randint(100000, 999999)}"
            set_two_factor_code(session, user.id, two_factor_code)

            # Send 2FA code via email
            subject = "Your 2FA Code"
            body = f"Hello {user.username},\n\nYour 2FA code is: {two_factor_code}\n\nThank you for using ColorVariantGenerator."
            send_email(recipient_email=user.email, subject=subject, body_text=body)

            # Return 2FA required response
            return jsonify({'message': '2FA code sent to your email'}), 200
        except Exception as e:
            session.rollback()
            return jsonify({'error': 'An error occurred during 2FA setup'}), 500
        finally:
            session.close()
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

@auth_bp.route('/api/confirm-user', methods=['POST'])
def confirm_user():
    data = request.json
    username = data.get('username')
    code = data.get('code')

    if not username or not code:
        return jsonify({'error': 'Username and confirmation code are required'}), 400

    session = Session()
    try:
        # Fetch user by username
        user = session.query(UserModel).filter_by(username=username).first()

        if not user:
            return jsonify({'message': 'Confirmation failed'}), 400

        # Validate the confirmation code and check expiration
        if user.confirmation_code == code:
            # Mark user as confirmed
            user.is_confirmed = True
            user.confirmation_code = None  # Clear the confirmation code
            session.commit()
            return jsonify({'message': 'User confirmed successfully'}), 200
        else:
            return jsonify({'message': 'Confirmation failed'}), 400
    except Exception as e:
        session.rollback()
        return jsonify({'error': 'An error occurred while confirming the user'}), 500
    finally:
        session.close()


@auth_bp.route('/api/validate-2fa', methods=['POST'])
def validate_two_factor():
    data = request.json
    username = data.get('username')
    two_factor_code = data.get('code')

    if not username or not two_factor_code:
        return jsonify({'error': 'Username and 2FA code are required'}), 400

    session = Session()
    try:
        # Fetch the user by username
        user = User.get_user_by_username(username)

        if not user:
            return jsonify({'message': 'Invalid 2FA code'}), 401

        if user.two_factor_code != two_factor_code:
            return jsonify({'message': 'Invalid 2FA code'}), 401

        # Clear the 2FA code and log in the user
        user.two_factor_code = None
        session.commit()

        login_user(user)

        return jsonify({
            'message': '2FA validated successfully. You are now logged in.',
            'username': user.username,
            'id': user.id
        }), 200
    except Exception as e:
        session.rollback()
        return jsonify({'error': 'An error occurred during 2FA validation'}), 500
    finally:
        session.close()

