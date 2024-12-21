from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
from database.models import Base
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Import Flask app for configuration
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://Your_Username123:Your_Password123@localhost/color_variant_db"
db = SQLAlchemy(app)

# Load the metadata from models.py
config = context.config
target_metadata = Base.metadata  # Use your Base metadata

# Database connection setup
def run_migrations_offline():
    context.configure(
        url=app.config['SQLALCHEMY_DATABASE_URI'],
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        url=app.config['SQLALCHEMY_DATABASE_URI']
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
