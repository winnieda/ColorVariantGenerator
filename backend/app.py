from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgb_color):
    return '#{:02x}{:02x}{:02x}'.format(rgb_color[0], rgb_color[1], rgb_color[2])

def adjust_color_value(base_value, variance):
    direction = random.choice([-1, 1])
    new_value = base_value + direction * variance
    new_value = max(0, min(255, new_value))  # Ensure the value is within the valid range
    return new_value

def generate_color_variant(base_rgb, variance):
    r_variance = random.randint(0, variance)
    g_variance = random.randint(0, variance - r_variance)
    b_variance = variance - r_variance - g_variance

    new_rgb = (
        adjust_color_value(base_rgb[0], r_variance),
        adjust_color_value(base_rgb[1], g_variance),
        adjust_color_value(base_rgb[2], b_variance)
    )
    return rgb_to_hex(new_rgb)

def generate_palette_variant(base_colors, variance):
    variants = [generate_color_variant(hex_to_rgb(color), variance) for color in base_colors]
    return variants

@app.route('/')
def home():
    return jsonify(message="Welcome to the Color Variant Generator API")

@app.route('/api/generate-variants', methods=['POST'])
def generate_variants():
    data = request.json
    colors = data['colors']
    variance = data['variance']
    num_to_generate = data['numToGenerate']
    colorGrouping = data['colorGrouping']

    all_variants = []
    for _ in range(num_to_generate):
        palette = generate_palette_variant(colors, variance)
        all_variants.append(palette)

    return jsonify({'variants': all_variants})

if __name__ == '__main__':
    app.run(debug=True)
