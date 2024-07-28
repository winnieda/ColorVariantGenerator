import React, { useState } from 'react';
import axios from 'axios';
import ColorInput from './ColorInput';
import { ColorOutputBatch } from './ColorOutput';
import '../css/CreatePalettePage.css';
import { normalizeInput, processNormalizedInput } from '../utils/InputParser.js';

const CreatePalettePage = () => {
  const [colors, setColors] = useState([{ id: 0, hex: '', r: '', g: '', b: '' }]);
  const [generatedColorsVisible, setGeneratedColorsVisible] = useState(false);
  const [generatedPalettes, setGeneratedPalettes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [colorGroupingError, setColorGroupingError] = useState(false);
  const [varianceError, setVarianceError] = useState(false);
  const [numToGenerateError, setNumToGenerateError] = useState(false);

  const addColor = () => {
    setColors([...colors, { id: colors.length, hex: '', r: '', g: '', b: '' }]);
  };

  const removeColor = (id) => {
    setColors(colors.filter((color) => color.id !== id));
  };

  const handleGeneratePalette = async () => {
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
    } else {
      setErrorMessage('');
      const variance = parseInt(document.getElementById('variance').value);
      const numToGenerate = parseInt(document.getElementById('numToGenerate').value);
      const colorGrouping = processNormalizedInput(document.getElementById('colorGrouping').value);
      
      try {
        const response = await axios.post('http://localhost:5000/api/generate-variants', {
          colors: colors.map(color => color.hex),
          variance: variance,
          numToGenerate: numToGenerate,
          colorGrouping: colorGrouping
        });
        console.log("Response: ", response.data.variants);
        setGeneratedPalettes(response.data.variants);
        setGeneratedColorsVisible(true);
      } catch (error) {
        console.error('Error generating color variants:', error);
      }
    }
  };

  const handleColorInputChange = (id, field, value) => {
    const updatedColors = colors.map((color) => {
      if (color.id === id) {
        let updatedColor = { ...color, [field]: value };
        const { hex, r, g, b } = updatedColor;
        if (field === 'hex') {
          // Remove any manually typed '#' and invalid characters
          value = value.replace(/[^0-9A-F]/gi, '');
          if (value) {
            updatedColor.hex = '#' + value;
          } else {
            updatedColor.hex = '';
          }
          // Validate and update RGB fields
          if (/^[0-9A-F]{6}$/i.test(value)) {
            const {r, g, b} = hexToRgb('#' + value);
            return { ...updatedColor, r, g, b, isValid: true };
          } else if (value === '') {
            // If hex is cleared, also clear RGB values
            return { ...updatedColor, r: '', g: '', b: '', isValid: false };
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
    // Check for at least one color
    if (colors.length === 0) {
      return 'There must be at least one color.';
    }

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

    // Handle the color grouping
    let colorGrouping = document.getElementById('colorGrouping').value;
    console.log('Before colorGrouping: ', colorGrouping);
    if (colorGrouping !== "") {
      try {
        colorGrouping = normalizeInput(colorGrouping);
        // Run the processing function so we can check for bad input
        processNormalizedInput(colorGrouping, colors.length);
        document.getElementById('colorGrouping').value = colorGrouping;
        setColorGroupingError(false);
      } catch (err) {
        console.error("ColorGrouping Error:", err);
        setColorGroupingError(true);
        return err.message;
      }
    } else {
      setColorGroupingError(false);
    }
    console.log('After colorGrouping: ', colorGrouping);

    // Check for blank variance
    const variance = document.getElementById('variance').value;
    if (variance === '') {
      setVarianceError(true);
      return 'Variance is blank.';
    } else {
      setVarianceError(false);
    }

    // Check if variance is 0 or higher
    if (parseInt(variance) < 0) {
      setVarianceError(true);
      return 'Variance must be 0 or higher.';
    } else {
      setVarianceError(false);
    }

    // Check for blank number of palettes to generate
    const numToGenerate = document.getElementById('numToGenerate').value;
    if (numToGenerate === '') {
      setNumToGenerateError(true);
      return 'Number of palettes is blank.';
    } else {
      setNumToGenerateError(false);
    }

    // Check if number of palettes is 0 or higher
    if (parseInt(numToGenerate) <= 0) {
      setNumToGenerateError(true);
      return 'Number of palettes must be higher than 0.';
    } else {
      setNumToGenerateError(false);
    }

    return null; // No errors found
  };

  const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const componentToHex = (c) => {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const rgbToHex = (r, g, b) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  };

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
              <div className="valueInput mb-3">
                <label htmlFor="variance">Variance:</label>
                <input type="number" id="variance" name="variance" className={`form-control ${varianceError ? 'is-invalid' : ''}`} />
              </div>
              <div className="valueInput mb-3">
                <label htmlFor="numToGenerate">Number of Palettes to Generate:</label>
                <input type="number" id="numToGenerate" name="numToGenerate" className={`form-control ${numToGenerateError ? 'is-invalid' : ''}`} />
              </div>
              <div className="valueInput mb-3">
                <label htmlFor="colorGrouping">Color Grouping: </label>
                <label className="labelExample" htmlFor="colorGroupingExample">ex: [1, 3, 4], [2, 5-7]</label>
                <input type="text" id="colorGrouping" name="colorGrouping" className={`form-control ${colorGroupingError ? 'is-invalid' : ''}`} />
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
        <div className="col-12">
          <div className="color-outputs">
            <h3>Original Palette:</h3>
            <ColorOutputBatch palette={colors.map(color => color.hex)} />
          </div>
        </div>
        {generatedColorsVisible && (
          <div className="col-12">
            <div className="color-outputs">
            <h3>Variant Palettes:</h3>
          </div>
            <div className="row">
              {generatedPalettes.map((palette, index) => (
                <div key={index} className="palette-output col-md-10 col-xl-5">
                  <div className="palette-label">Palette {index + 1}:</div>
                  <ColorOutputBatch palette={palette} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePalettePage;
