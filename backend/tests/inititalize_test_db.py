from sqlalchemy import create_engine
from database.models import Base

DATABASE_URL = "mysql+pymysql://test_user:test_password@localhost/test_db"
engine = create_engine(DATABASE_URL)

def initialize_database():
    # Create tables based on models
    Base.metadata.create_all(engine)
    print("Test database initialized successfully.")

if __name__ == "__main__":
    initialize_database()
