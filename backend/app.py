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

def adjust_color_value(base_value, variance, is_increase):
    if is_increase:
        new_value = min(255, base_value + variance)
    else:
        new_value = max(0, base_value - variance)
    return new_value

def generate_color_variant(base_rgb, variance):
    r_variance = random.randint(0, variance)
    g_variance = random.randint(0, variance - r_variance)
    b_variance = variance - r_variance - g_variance

    r_increased = random.choice([True, False])
    g_increased = random.choice([True, False])
    b_increased = random.choice([True, False])

    new_rgb = (
        adjust_color_value(base_rgb[0], r_variance, r_increased),
        adjust_color_value(base_rgb[1], g_variance, g_increased),
        adjust_color_value(base_rgb[2], b_variance, b_increased)
    )
    return rgb_to_hex(new_rgb), (r_variance, g_variance, b_variance), (r_increased, g_increased, b_increased)

def apply_variance_to_group(base_rgb, variance, r_variance, g_variance, b_variance, r_increased, g_increased, b_increased):
    new_rgb = (
        adjust_color_value(base_rgb[0], r_variance, r_increased),
        adjust_color_value(base_rgb[1], g_variance, g_increased),
        adjust_color_value(base_rgb[2], b_variance, b_increased)
    )
    return rgb_to_hex(new_rgb)

def generate_palette_variant(base_colors, variance, colorGrouping):
    variants = [None] * len(base_colors)
    for group in colorGrouping:
        base_index = group[0] - 1  # Shift index
        base_rgb = hex_to_rgb(base_colors[base_index])
        variant, (r_var, g_var, b_var), (r_inc, g_inc, b_inc) = generate_color_variant(base_rgb, variance)
        for index in group:
            color_index = index - 1  # Shift index
            group_rgb = hex_to_rgb(base_colors[color_index])
            variants[color_index] = apply_variance_to_group(group_rgb, variance, r_var, g_var, b_var, r_inc, g_inc, b_inc)
    
    # Fill in any remaining colors not in groups
    for i in range(len(variants)):
        if variants[i] is None:
            base_rgb = hex_to_rgb(base_colors[i])
            variants[i], _, _ = generate_color_variant(base_rgb, variance)
    
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
        palette = generate_palette_variant(colors, variance, colorGrouping)
        all_variants.append(palette)

    return jsonify({'variants': all_variants})

if __name__ == '__main__':
    app.run(debug=True)
