import os
import subprocess
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from alembic.config import Config
from alembic import command

# MySQL configuration
DB_HOST = "localhost"
DB_PORT = 3306
DB_NAME = "color_variant_db"
DB_USER = "Your_Username123"
DB_PASSWORD = "Your_Password123"
ROOT_PASSWORD = "Root_Password123"  # Set or change your MySQL root password
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"


def check_mysql_installed():
    """Check if MySQL is installed and install it if missing."""
    try:
        subprocess.run(["mysql", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("MySQL is installed.")
    except FileNotFoundError:
        print("MySQL is not installed. Installing...")
        subprocess.run(["sudo", "apt-get", "update"])
        subprocess.run(["sudo", "apt-get", "install", "-y", "mysql-server"])
        print("MySQL installed successfully.")


def start_mysql_service():
    """Ensure MySQL service is running."""
    try:
        subprocess.run(["sudo", "systemctl", "start", "mysql"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("MySQL service started.")
    except subprocess.CalledProcessError as e:
        print("Failed to start MySQL service. Ensure it is installed and properly configured.")
        print(e)
        exit(1)


def configure_mysql_root():
    """Configure MySQL root user with a password if not already set."""
    try:
        print("Configuring MySQL root user...")
        subprocess.run([
            "sudo", "mysql", "-e",
            f"ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '{ROOT_PASSWORD}';"
        ], check=True)
        subprocess.run([
            "sudo", "mysql", "-e",
            "FLUSH PRIVILEGES;"
        ], check=True)
        print("MySQL root user configured.")
    except subprocess.CalledProcessError as e:
        print("Failed to configure MySQL root user.")
        print(e)
        exit(1)


def initialize_database():
    """Initialize the database and user."""
    try:
        # Connect as root to create database and user
        root_engine = create_engine(f"mysql+pymysql://root:{ROOT_PASSWORD}@{DB_HOST}:{DB_PORT}")
        with root_engine.connect() as conn:
            # Create database
            conn.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
            print(f"Database '{DB_NAME}' created or already exists.")

            # Create user and grant privileges
            conn.execute(f"CREATE USER IF NOT EXISTS '{DB_USER}'@'{DB_HOST}' IDENTIFIED BY '{DB_PASSWORD}'")
            conn.execute(f"GRANT ALL PRIVILEGES ON {DB_NAME}.* TO '{DB_USER}'@'{DB_HOST}'")
            conn.execute("FLUSH PRIVILEGES")
            print(f"User '{DB_USER}' created or already exists.")
    except OperationalError as e:
        print("Error connecting as root. Ensure MySQL root access is available.")
        print(e)
        exit(1)


def run_alembic_migrations():
    """Run Alembic migrations."""
    alembic_cfg = Config("alembic.ini")
    alembic_cfg.set_main_option("sqlalchemy.url", DATABASE_URL)
    try:
        command.upgrade(alembic_cfg, "head")
        print("Alembic migrations applied successfully.")
    except Exception as e:
        print("Error applying migrations.")
        print(e)
        exit(1)


if __name__ == "__main__":
    print("Starting database setup...")
    check_mysql_installed()
    start_mysql_service()
    configure_mysql_root()
    initialize_database()
    run_alembic_migrations()
    print("Database setup complete.")
