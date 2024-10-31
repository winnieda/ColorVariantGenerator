import mysql.connector
import json
from mysql.connector import Error

def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="your_username",
        password="your_password",
        database="color_variant_db"
    )
    return connection

# Save a new palette for a user
def save_palette(user_id, palette_data):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO Palette (user_id, palette_data) VALUES (%s, %s)", 
                       (user_id, json.dumps(palette_data)))
        conn.commit()
    finally:
        conn.close()

# Retrieve all palettes for a specific user
def get_palettes(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT id, palette_data, created_at FROM Palette WHERE user_id = %s", (user_id,))
        palettes = cursor.fetchall()
        return palettes
    finally:
        conn.close()
