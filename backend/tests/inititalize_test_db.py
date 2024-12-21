from sqlalchemy import create_engine
from database.models import Base

DATABASE_URL = "mysql+pymysql://Your_Username123:Your_Password123@localhost/test_db"
engine = create_engine(DATABASE_URL)

def initialize_database():
    # Create tables based on models
    Base.metadata.create_all(engine)
    print("Test database initialized successfully.")

if __name__ == "__main__":
    initialize_database()
