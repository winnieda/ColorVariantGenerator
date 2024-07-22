from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify(message="Welcome to the Color Variant Generator API")

@app.route('/api/generate-variants', methods=['POST'])
def generate_variants():
    data = request.json
    # Mock response for testing
    response = {
        'variants': [
            ["#FF5733", "#FF6F33", "#FF5733"],  # Variants for color 1
            ["#33FF57", "#33FF6F", "#33FF57"],  # Variants for color 2
            ["#3357FF", "#336FFF", "#3357FF"]   # Variants for color 3
        ]
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
