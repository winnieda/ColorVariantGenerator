import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from alembic.config import Config
from alembic import command

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://your_username:your_password@localhost/color_variant_db"
db = SQLAlchemy(app)

def run_migrations():
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    print("Database migrations applied successfully.")

if __name__ == "__main__":
    run_migrations()
