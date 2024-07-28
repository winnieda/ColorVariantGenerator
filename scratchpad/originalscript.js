$(document).ready(function() {
    // Dynamically update color input fields based on the number specified by the user
    function updateColorInputs() {
        let numColors = parseInt($('#numColors').val()); // Get the number of colors
        $('#colorInputs').empty(); // Clear existing color inputs
        for (let i = 1; i <= numColors; i++) {
            // Append new color input fields for R, G, and B values
            $('#colorInputs').append(`
                <div class="colorInput">
                    <label>Color ${i}: </label>
                    <input type="number" class="r-value" min="0" max="255" placeholder="R">
                    <input type="number" class="g-value" min="0" max="255" placeholder="G">
                    <input type="number" class="b-value" min="0" max="255" placeholder="B"><br>
                </div>
            `);
        }
    }

    // Helper function to print a color inside a square with RGB values displayed next to it
    function printColor(color, label) {
        $('#generatedColors').append(`
            <div>
                <div class="color-box" style="background-color: rgb(${color.r}, ${color.g}, ${color.b});"></div>
                <div class="color-info">${label}: {${color.r}, ${color.g}, ${color.b}}</div>
            </div>
        `);
    }

    // Refresh color input field when number of colors changes
    $('#numColors').on('input', function() {
        updateColorInputs();
    });

    // Handle click event for the "Generate colors" button
    $('#generateColors').click(function() {
        $('#errorMessage').text('');
        $('#generatedColors').empty();

        let numColors = parseInt($('#numColors').val());
        let variance = parseInt($('#variance').val());
        let numToGenerate = parseInt($('#numToGenerate').val());
        
        // Ensure at least one color is input
        if (numColors <= 0) {
            $('#errorMessage').text('Need to input at least one color');
            return;
        }

        // Ensure at least one color is to be generated
        if (!numToGenerate || numToGenerate <= 0) {
            $('#errorMessage').text('Need to generate at least one color');
            return;
        }

        // Check if variance is set
        if (!variance) {
            $('#errorMessage').text('Variance is not set');
            return;
        }

        let colors = [];
        let valid = true;
        
        // Get the input colors
        $('.colorInput').each(function() {
            let r = parseInt($(this).find('.r-value').val());
            let g = parseInt($(this).find('.g-value').val());
            let b = parseInt($(this).find('.b-value').val());

            // Colors must not be unspecified or not 0 >= # >= 255
            if (isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
                valid = false;
            }

            colors.push({r: r, g: g, b: b});
        });

        // Display error message if any color value is invalid
        if (!valid) {
            $('#errorMessage').text('All color values must be specified and between 0 and 255. Hint: Specify fewer colors if you don\'t want more colors');
            return;
        }

        // Print Original Colors
        $('#generatedColors').append('<p>Original Colors:</p>');
        colors.forEach((color, index) => {
            printColor(color, `Original Color ${index + 1}`);
        });

        // Generate and Print Color Variants
        $('#generatedColors').append('<p>Color Variants:</p>');
        for (let i = 0; i < numToGenerate; i++) {
            // Select a random base color
            let baseColor = colors[Math.floor(Math.random() * colors.length)]; 

            // Randomly distribute variance among R, G, and B
            let rVariance = Math.floor(Math.random() * (variance + 1));
            let gVariance = Math.floor(Math.random() * (variance - rVariance + 1));
            let bVariance = variance - rVariance - gVariance;

            // Adjust the color values while ensuring they remain valid
            let newColor = {
                r: adjustColorValue(baseColor.r, rVariance),
                g: adjustColorValue(baseColor.g, gVariance),
                b: adjustColorValue(baseColor.b, bVariance)
            };

            // Print the new color variant
            printColor(newColor, `Variant ${i + 1}`); 
        }
    });

    // Function to adjust a color value based on given variance
    function adjustColorValue(baseValue, variance) {
        // Randomly decide to increase or decrease the value
        let direction = Math.random() < 0.5 ? -1 : 1; 
        let newValue = baseValue + direction * variance;

        // If the new value is out of bounds, try the opposite direction
        if (newValue > 255) {
            newValue = baseValue - variance;
        } else if (newValue < 0) {
            newValue = baseValue + variance;
        }

        // Ensure the value is within the valid range
        return Math.max(0, Math.min(255, newValue)); 
    }

    updateColorInputs(); 
});
