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
    
    # Get username, check if exists
    cursor.execute("SELECT username FROM User WHERE id = %s", (user_id,))
    user_data = cursor.fetchone()
    if not user_data:
        conn.close()
        return None
    
    username = user_data['username']

    # Fetch palettes for user
    cursor.execute("SELECT * FROM Palettes WHERE user_id = %s", (user_id,))
    palettes = cursor.fetchall()
    conn.close()
    
    return palettes, username

# Test function for database
def test_database_connection():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT DATABASE()")
    result = cursor.fetchone()
    return f"Connected to: {result[0]}\n"