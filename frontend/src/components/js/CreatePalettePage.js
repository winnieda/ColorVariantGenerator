import React, { useState } from 'react';
import ColorInput from './ColorInput';
import { ColorOutputBatch } from './ColorOutput';
import '../css/CreatePalettePage.css';

const CreatePalettePage = () => {
  const [colors, setColors] = useState([{ id: 0, hex: '', r: '', g: '', b: '' }]);
  const [generatedColorsVisible, setGeneratedColorsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const addColor = () => {
    setColors([...colors, { id: colors.length, hex: '', r: '', g: '', b: '' }]);
  };

  const removeColor = (id) => {
    setColors(colors.filter((color) => color.id !== id));
  };

  const handleGeneratePalette = () => {
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
    } else {
      setErrorMessage('');
      setGeneratedColorsVisible(true);
      // Placeholder for generate palette functionality
    }
  };

  const handleColorInputChange = (id, field, value) => {
    const updatedColors = colors.map((color) => {
      if (color.id === id) {
        const updatedColor = { ...color, [field]: value };
        const { hex, r, g, b } = updatedColor;
        if (field === 'hex') {
          // Validate and update RGB fields
          if (/^#[0-9A-F]{6}$/i.test(hex)) {
            const [r, g, b] = hexToRgb(hex);
            return { ...updatedColor, r, g, b, isValid: true };
          } else {
            return { ...updatedColor, isValid: false };
          }
        } else {
          // Validate and update hex field
          const validRgb = [r, g, b].every((val) => val >= 0 && val <= 255 && val !== '');
          if (validRgb) {
            const hex = rgbToHex(parseInt(r), parseInt(g), parseInt(b));
            return { ...updatedColor, hex, isValid: true };
          } else {
            return { ...updatedColor, isValid: false };
          }
        }
      }
      return color;
    });
    setColors(updatedColors);
  };

  const validateForm = () => {
    // Check for invalid colors
    for (const color of colors) {
      if (color.isValid === false) {
        return 'At least one color is invalid.';
      }
    }

    // Check for blank colors
    for (const color of colors) {
      if (color.hex === '' || color.r === '' || color.g === '' || color.b === '') {
        return 'At least one color is blank.';
      }
    }

    // Check for blank variance
    const variance = document.getElementById('variance').value;
    if (variance === '') {
      return 'Variance is blank.';
    }

    // Check if variance is 0 or higher
    if (parseInt(variance) < 0) {
      return 'Variance must be 0 or higher.';
    }

    // Check for blank number of colors to generate
    const numToGenerate = document.getElementById('numToGenerate').value;
    if (numToGenerate === '') {
      return 'Number of colors is blank.';
    }

    // Check if number of colors is 0 or higher
    if (parseInt(numToGenerate) <= 0) {
      return 'Number of colors must be higher than 0.';
    }

    return null; // No errors found
  };

  const hexToRgb = (hex) => {
    hex = hex.replace(/^#/, '');
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  };

  const componentToHex = (c) => {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  const rgbToHex = (r, g, b) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 mb-4">
          <div className="color-inputs">
            {colors.map((color) => (
              <ColorInput
                key={color.id}
                id={color.id}
                hex={color.hex}
                r={color.r}
                g={color.g}
                b={color.b}
                isValid={color.isValid}
                onInputChange={handleColorInputChange}
                removeColor={removeColor}
              />
            ))}
          </div>
          <button onClick={addColor} className="add-color-btn">+ Add Color</button>
        </div>
        <div className="col-12 mb-4">
          <div className="row">
            <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="variance">Variance:</label>
                <input type="number" id="variance" name="variance" className="form-control" />
              </div>
              <div className="mb-3">
                <label htmlFor="numToGenerate">Number of Colors to Generate:</label>
                <input type="number" id="numToGenerate" name="numToGenerate" className="form-control" />
              </div>
              <button onClick={handleGeneratePalette} className="btn btn-success">Generate Palette</button>
              {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
            </div>
            <div className="col-md-9">
              <div className="explanation">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </div>
          </div>
        </div>
        {generatedColorsVisible && (
          <div className="col-12">
          <div className="color-outputs">
            <h3>Original Colors:</h3>
            {/* Print Original Colors */}
          </div>
            <div className="color-outputs">
              <h3>Generated Colors:</h3>
              {/* ColorOutputBatch will be used here after integrating with backend */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePalettePage;
