from PIL import Image

def replace_colors(image, original_palette, variant_palette):
    # Ensure palettes have the same length
    if len(original_palette) != len(variant_palette):
        raise ValueError("Original and variant palettes must have the same length")

    # Convert hex color strings to RGB tuples
    original_palette_rgb = [tuple(int(palette[i:i+2], 16) for i in (1, 3, 5)) for palette in original_palette]
    variant_palette_rgb = [tuple(int(palette[i:i+2], 16) for i in (1, 3, 5)) for palette in variant_palette]

    # Load the image and prepare for processing
    img = image.convert("RGB")
    pixels = img.load()

    # Create a new image to avoid modifying the original image
    new_img = Image.new("RGB", img.size)
    new_pixels = new_img.load()

    for y in range(img.height):
        for x in range(img.width):
            original_color = pixels[x, y]
            if original_color in original_palette_rgb:
                # Get the index of the original color
                index = original_palette_rgb.index(original_color)
                # Replace with the variant color
                new_pixels[x, y] = variant_palette_rgb[index]
            else:
                # Keep the original color if it's not in the palette
                new_pixels[x, y] = original_color

    return new_img

def main():
    # Example hard-coded variables
    original_palette = ["#829fbc", "#e7c79b", "#b49679"]  # Example original palette
    variant_palette = ["#6999cf", "#dfc973", "#daa17a"]  # Example variant palette

    # Load an example image (replace 'example.png' with your actual image path)
    image = Image.open("Gary_Blastoise.webp")

    # Process the image
    new_image = replace_colors(image, original_palette, variant_palette)

    # Save the new image
    new_image.save("transformed_image.png")

if __name__ == "__main__":
    main()
