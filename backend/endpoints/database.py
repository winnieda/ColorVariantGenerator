from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from database.models import Base, Palette, User
from database.palette_functions import create_palette, read_palette
import json

# Database connection setup
DATABASE_URL = "mysql+pymysql://your_username:your_password@localhost/color_variant_db"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

# Save a new palette for a user
def save_palette(user_id, palette_data):
    session = Session()
    try:
        create_palette(session, user_id=user_id, palette_data=palette_data)
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

# Retrieve all palettes for a specific user
def get_palettes(user_id):
    session = Session()
    try:
        # Query the user
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            return None

        # Fetch palettes for the user
        palettes = session.query(Palette).filter_by(user_id=user_id).all()

        # Convert palettes into the required format
        serialized_palettes = [
            {
                'id': palette.id,
                'user_id': palette.user_id,  # Include user_id
                'palette_data': json.dumps(palette.palette_data),  # Serialize palette_data as a string
                'created_at': palette.created_at.strftime("%a, %d %b %Y %H:%M:%S GMT")  # Format as HTTP date
            }
            for palette in palettes
        ]

        return serialized_palettes, user.username
    finally:
        session.close()


# Test function for database
def test_database_connection():
    session = Session()
    try:
        result = session.execute("SELECT DATABASE()").fetchone()
        return f"Connected to: {result[0]}\n"
    finally:
        session.close()
