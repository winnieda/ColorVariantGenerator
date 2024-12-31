from sqlalchemy import create_engine
from database.models import Base
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to the database
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

# Create tables
Base.metadata.create_all(engine)

print("Database and tables created successfully!")
