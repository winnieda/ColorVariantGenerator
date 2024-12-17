import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.models import Base, User, Palette
from database.palette_functions import create_palette, read_palette, update_palette, delete_palette

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

@pytest.fixture
def test_user(session):
    user = User(username="paletteuser", password_hash="hashed_pw")
    session.add(user)
    session.commit()
    return user

def test_create_palette(session, test_user):
    palette = create_palette(session, user_id=test_user.id, palette_data={"colors": ["#FFFFFF", "#000000"]})
    assert palette.id is not None
    assert palette.user_id == test_user.id

def test_read_palette(session, test_user):
    palette = create_palette(session, user_id=test_user.id, palette_data={"colors": ["#FF0000", "#00FF00"]})
    fetched_palette = read_palette(session, palette.id)
    assert fetched_palette is not None
    assert fetched_palette.palette_data == {"colors": ["#FF0000", "#00FF00"]}

def test_update_palette(session, test_user):
    palette = create_palette(session, user_id=test_user.id, palette_data={"colors": ["#0000FF"]})
    updated_palette = update_palette(session, palette.id, palette_data={"colors": ["#FFFF00"]})
    assert updated_palette.palette_data == {"colors": ["#FFFF00"]}

def test_delete_palette(session, test_user):
    palette = create_palette(session, user_id=test_user.id, palette_data={"colors": ["#123456"]})
    success = delete_palette(session, palette.id)
    assert success is True
    assert read_palette(session, palette.id) is None
