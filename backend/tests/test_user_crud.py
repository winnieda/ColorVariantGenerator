import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.models import Base, User
from database.user_functions import create_user, read_user, update_user, delete_user
from datetime import datetime, timezone

# Setup for the database connection
DATABASE_URL = "mysql+pymysql://test_user:test_password@localhost/test_db"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

# Ensure the test database schema is created
@pytest.fixture(scope="function", autouse=True)
def setup_database():
    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)

@pytest.fixture
def session():
    session = Session()
    yield session
    session.close()

def test_create_user(session):
    """Test creation of a user with all fields."""
    now = datetime.now()  # Make `now` naive
    user = create_user(
        session,
        username="testuser",
        password_hash="hashed_pw",
        email="test@example.com"
    )
    assert user.id is not None
    assert user.username == "testuser"
    assert user.password_hash == "hashed_pw"
    assert user.email == "test@example.com"
    assert user.created_at >= now
    assert user.confirmation_code is None
    assert user.is_confirmed is False

def test_read_user(session):
    """Test reading a user by ID."""
    user = create_user(
        session,
        username="readtest",
        password_hash="hashed_pw",
        email="read@example.com"
    )
    fetched_user = read_user(session, user.id)
    assert fetched_user is not None
    assert fetched_user.id == user.id
    assert fetched_user.username == "readtest"
    assert fetched_user.email == "read@example.com"

def test_update_user_username(session):
    """Test updating a user's username."""
    user = create_user(session, username="originaluser", password_hash="hashed_pw", email="user@example.com")
    updated_user = update_user(session, user.id, username="updateduser")
    assert updated_user.username == "updateduser"

def test_update_user_email(session):
    """Test updating a user's email."""
    user = create_user(session, username="userwithemail", password_hash="hashed_pw", email="oldemail@example.com")
    updated_user = update_user(session, user.id, email="newemail@example.com")
    assert updated_user.email == "newemail@example.com"

def test_update_user_password_hash(session):
    """Test updating a user's password hash."""
    user = create_user(session, username="userwithpassword", password_hash="oldhash", email="password@example.com")
    updated_user = update_user(session, user.id, password_hash="newhash")
    assert updated_user.password_hash == "newhash"

def test_update_user_confirmation_code(session):
    """Test updating a user's confirmation code."""
    user = create_user(session, username="confirmuser", password_hash="hashed_pw", email="confirm@example.com")
    updated_user = update_user(session, user.id, confirmation_code="ABC123")
    assert updated_user.confirmation_code == "ABC123"

def test_update_user_is_confirmed(session):
    """Test updating a user's confirmation status."""
    user = create_user(session, username="confirmstatus", password_hash="hashed_pw", email="confirmstatus@example.com")
    updated_user = update_user(session, user.id, is_confirmed=True)
    assert updated_user.is_confirmed is True

def test_delete_user(session):
    """Test deleting a user."""
    user = create_user(session, username="deleteuser", password_hash="hashed_pw", email="delete@example.com")
    success = delete_user(session, user.id)
    assert success is True
    assert read_user(session, user.id) is None

def test_create_user_with_nullable_email(session):
    """Test creating a user without providing an email."""
    user = create_user(session, username="nouseremail", password_hash="hashed_pw", email=None)
    assert user.id is not None
    assert user.email is None

def test_create_user_with_duplicate_username(session):
    """Test creating a user with a duplicate username."""
    create_user(session, username="duplicateuser", password_hash="hashed_pw", email="first@example.com")
    with pytest.raises(Exception):
        create_user(session, username="duplicateuser", password_hash="hashed_pw", email="second@example.com")

def test_create_user_with_duplicate_email(session):
    """Test creating a user with a duplicate email."""
    create_user(session, username="user1", password_hash="hashed_pw", email="same@example.com")
    with pytest.raises(Exception):
        create_user(session, username="user2", password_hash="hashed_pw", email="same@example.com")
