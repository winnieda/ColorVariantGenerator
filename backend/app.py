from flask import Flask, jsonify, request
from flask_login import current_user
from flask_cors import CORS
from login import auth_bp, login_manager
from PIL import Image
import random
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = 'your_secret_key_here'  # Set a secure secret key

app.config['SESSION_COOKIE_SAMESITE'] = "None"    # Allows cross-site cookies
app.config['SESSION_COOKIE_SECURE'] = True        # Requires HTTPS
# app.config['SESSION_COOKIE_SECURE'] = False

# Initialize Flask-Login
login_manager.init_app(app)

# Register the auth blueprint
app.register_blueprint(auth_bp)

def is_within_tolerance(color1, color2, tolerance=10):
    return all(abs(c1 - c2) <= tolerance for c1, c2 in zip(color1, color2))

def make_variant_image(image, original_palette, variant_palette, tolerance=10):
    # a tolerance of about 10 should compensate for compression
    if len(original_palette) != len(variant_palette):
        raise ValueError("Original and variant palettes must have the same length")

    # Convert hex to RGB
    original_palette_rgb = [tuple(int(palette[i:i+2], 16) for i in (1, 3, 5)) for palette in original_palette]
    variant_palette_rgb = [tuple(int(palette[i:i+2], 16) for i in (1, 3, 5)) for palette in variant_palette]

    img = image.convert("RGB")
    pixels = img.load()

    # Create new image to avoid errors from modifying original image
    new_img = Image.new("RGB", img.size)
    new_pixels = new_img.load()

    for y in range(img.height):
        for x in range(img.width):
            original_color = pixels[x, y]
            matched = False
            for i, palette_color in enumerate(original_palette_rgb):
                if is_within_tolerance(original_color, palette_color, 10):
                    new_pixels[x, y] = variant_palette_rgb[i]
                    matched = True
                    break
            if not matched:
                new_pixels[x, y] = original_color

    return new_img

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
        base_index = group[0] - 1
        base_rgb = hex_to_rgb(base_colors[base_index])
        variant, (r_var, g_var, b_var), (r_inc, g_inc, b_inc) = generate_color_variant(base_rgb, variance)
        for index in group:
            color_index = index - 1
            group_rgb = hex_to_rgb(base_colors[color_index])
            variants[color_index] = apply_variance_to_group(group_rgb, variance, r_var, g_var, b_var, r_inc, g_inc, b_inc)
    
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

@app.route('/api/create-variant-picture', methods=['POST'])
def create_variant_picture():
    data = request.json
    original_colors = data['originalColors']
    variant_colors = data['variantColors']
    original_image = data['originalImage']  # string, not image

    # Decode the base64 image
    image_data = base64.b64decode(original_image.split(',')[1])
    image = Image.open(BytesIO(image_data))

    # Process the image
    variantImage_out = make_variant_image(image, original_colors, variant_colors)

    # Save the image to a buffer in memory and re-encode as base64
    buffered = BytesIO()
    variantImage_out.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')

    # Send the base64 encoded image back as part of the response
    return jsonify({'variantImage': f"data:image/png;base64,{img_str}"})

@app.route('/check-session', methods=['GET'])
def check_session():
    if current_user.is_authenticated:
        return jsonify(isAuthenticated=True), 200
    return jsonify(isAuthenticated=False), 200

if __name__ == '__main__':
    app.run(debug=True)
