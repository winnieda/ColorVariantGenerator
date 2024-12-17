import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import axios from 'axios';
import ColorInput from './ColorInput';
import { ColorOutputBatch } from './ColorOutput';
import PaletteOutput from './PaletteOutput';
import '../css/CreatePalettePage.css';
import { normalizeInput, processNormalizedInput } from '../utils/InputParser.js';
import { PaletteContext } from './context/PaletteContext.js';
import ImageUpload from './ImageUpload';

const CreatePalettePage = (isAuthenticated) => {
  const { paletteState, setPaletteState } = useContext(PaletteContext);
  const [selectedPaletteIndex, setSelectedPaletteIndex] = React.useState(null);
  const [uploadedImage, setUploadedImage] = React.useState(null);
  const [variantImage, setVariantImage] = React.useState(null);
  const location = useLocation();

  const {
    colors,
    generatedColorsVisible,
    generatedPalettes,
    errorMessage,
    colorGroupingError,
    varianceError,
    numToGenerateError,
    originalColors, // Colors of current variant palettes
    variance,
    numToGenerate,
    colorGrouping
  } = paletteState;

  useEffect(() => {
    // Check if the navigation came from the preset page
    const navigatedFromPreset = sessionStorage.getItem('navigatedFromPreset');
    if (navigatedFromPreset && location.state) {
      setPaletteState({
        ...paletteState,
        colors: location.state.colors || [],
        colorGrouping: location.state.colorGrouping || ''
      });
      setUploadedImage(location.state.uploadedImage || null);
      // Clear the flag after applying the state
      sessionStorage.removeItem('navigatedFromPreset');
    }
  }, [location.state, setPaletteState]);

  // const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '/api';
  const apiBaseUrl = 'http://127.0.0.1:5000/api';

  const addColor = () => {
    setPaletteState({
      ...paletteState,
      colors: [...colors, { id: colors.length, hex: '', r: '', g: '', b: '' }]
    });
  };

  const removeColor = (id) => {
    setPaletteState({
      ...paletteState,
      colors: colors.filter((color) => color.id !== id).map((color) => 
        color.id > id ? { ...color, id: color.id - 1 } : color
      )
    });
  };

  const onEyedropperClick = async (id) => {
    if (!window.EyeDropper) {
      alert('Sorry, your browser does not support the EyeDropper API.' +
        ' Firefox users can go to More Tools > Eyedropper and paste into ' +
        'the hex field as an easy alternative.');
      return;
    }
    try {
      const eyeDropper = new window.EyeDropper();
      eyeDropper.open().then((result) => {
        handleColorInputChange(id, 'hex', result.sRGBHex);
      });
    } catch (error) {
      console.error('Error using the EyeDropper API:', error);
    }
  };

  // Function for when green "Generate Palette" is clicked
  const handleGeneratePalette = async () => {
    const error = validateForm();
    if (error) {
      setPaletteState({ ...paletteState, errorMessage: error });
    } else {
      setPaletteState({ ...paletteState, errorMessage: '' });
      const variance = parseInt(document.getElementById('variance').value);
      const numToGenerate = parseInt(document.getElementById('numToGenerate').value);
      const colorGrouping = processNormalizedInput(document.getElementById('colorGrouping').value);
  
      try {
        const response = await axios.post(`${apiBaseUrl}/generate-variants`, {
          colors: colors.map(color => color.hex),
          variance: variance,
          numToGenerate: numToGenerate,
          colorGrouping: colorGrouping
        });
        setPaletteState({
          ...paletteState,
          generatedPalettes: response.data.variants,
          generatedColorsVisible: true,
          originalColors: colors,
          variantImage: null,
        });
      } catch (error) {
        console.error('Error generating color variants:', error);
        alert('There was an error generating the color variants. Please try again.');
      }
    }
  };
  
  const handleColorInputChange = (id, field, value) => {
    const updatedColors = colors.map((color) => {
      if (color.id === id) {
        let updatedColor = { ...color, [field]: value };
        const { hex, r, g, b } = updatedColor;
        if (field === 'hex') {
          value = value.replace(/[^0-9A-F]/gi, '');
          if (value) {
            updatedColor.hex = '#' + value;
          } else {
            updatedColor.hex = '';
          }
          if (/^[0-9A-F]{6}$/i.test(value)) {
            const { r, g, b } = hexToRgb('#' + value);
            return { ...updatedColor, r, g, b, isValid: true };
          } else if (value === '') {
            return { ...updatedColor, r: '', g: '', b: '', isValid: false };
          } else {
            return { ...updatedColor, isValid: false };
          }
        } else {
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
    setPaletteState({ ...paletteState, colors: updatedColors });
  };

  const validateForm = () => {
    if (colors.length === 0) {
      return 'There must be at least one color.';
    }

    for (const color of colors) {
      if (color.isValid === false) {
        return 'At least one color is invalid.';
      }
    }

    for (const color of colors) {
      if (color.hex === '' || color.r === '' || color.g === '' || color.b === '') {
        return 'At least one color is blank.';
      }
    }

    let colorGrouping = document.getElementById('colorGrouping').value;
    if (colorGrouping !== "") {
      try {
        colorGrouping = normalizeInput(colorGrouping);
        processNormalizedInput(colorGrouping, colors.length);
        document.getElementById('colorGrouping').value = colorGrouping;
        setPaletteState({ ...paletteState, colorGroupingError: false });
      } catch (err) {
        console.error("ColorGrouping Error:", err);
        setPaletteState({ ...paletteState, colorGroupingError: true });
        return err.message;
      }
    } else {
      setPaletteState({ ...paletteState, colorGroupingError: false });
    }

    const variance = document.getElementById('variance').value;
    if (variance === '') {
      setPaletteState({ ...paletteState, varianceError: true });
      return 'Variance is blank.';
    } else {
      setPaletteState({ ...paletteState, varianceError: false });
    }

    if (parseInt(variance) < 0) {
      setPaletteState({ ...paletteState, varianceError: true });
      return 'Variance must be 0 or higher.';
    } else {
      setPaletteState({ ...paletteState, varianceError: false });
    }

    const numToGenerate = document.getElementById('numToGenerate').value;
    if (numToGenerate === '') {
      setPaletteState({ ...paletteState, numToGenerateError: true });
      return 'Number of palettes is blank.';
    } else {
      setPaletteState({ ...paletteState, numToGenerateError: false });
    }

    if (parseInt(numToGenerate) <= 0) {
      setPaletteState({ ...paletteState, numToGenerateError: true });
      return 'Number of palettes must be higher than 0.';
    } else {
      setPaletteState({ ...paletteState, numToGenerateError: false });
    }

    return null;
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

  // When user clicks generated palette to make a new picture
  const handlePaletteClick = async (index) => {
    const variantColors = generatedPalettes[index];
  
    if (selectedPaletteIndex !== index) {
      setSelectedPaletteIndex(index);
      try {
        setVariantImage('/images/loadingIcon.jpg');
        const response = await axios.post(`${apiBaseUrl}/create-variant-picture`, {
          originalColors: originalColors.map(originalColors => originalColors.hex),
          variantColors: variantColors,
          originalImage: uploadedImage,
        });
        setVariantImage(response.data.variantImage);
      } catch (error) {
        console.error('Error generating color variants:', error);
        alert('There was an error generating the color variants. Please try again.');
        setVariantImage(null);
      }
    }
  };
  
  React.useEffect(() => {
    setSelectedPaletteIndex(null);
  }, [generatedPalettes]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPaletteState({
      ...paletteState,
      [name]: value
    });
  };

  const clearAll = () => {
    setPaletteState({
      colors: [{ id: 0, hex: '', r: '', g: '', b: '' }],
      generatedColorsVisible: false,
      generatedPalettes: [],
      errorMessage: '',
      colorGroupingError: false,
      varianceError: false,
      numToGenerateError: false,
      originalColors: null,
      variance: '',
      numToGenerate: '',
      colorGrouping: ''
    });
    setUploadedImage(null);
    setVariantImage(null);
    setSelectedPaletteIndex(null);
  };

  return (
    <div className="container mt-5">
      <button onClick={clearAll} className="btn btn-warning clear-button">Clear Page</button>
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
                onEyedropperClick={onEyedropperClick}
              />
            ))}
          </div>
          <button onClick={addColor} className="add-color-btn">+ Add Color</button>
          <div className="default-colors">
            <ColorOutputBatch palette={colors.map(color => color.hex)} wide={true} />
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="row">
            <div className="col-md-3">
              <div className="valueInput mb-3">
                <label htmlFor="variance">Variance:</label>
                <input
                  type="number"
                  id="variance"
                  name="variance"
                  value={variance}
                  onChange={handleInputChange}
                  className={`form-control ${varianceError ? 'is-invalid' : ''}`}
                />
              </div>
              <div className="valueInput mb-3">
                <label htmlFor="numToGenerate">Number of Palettes to Generate:</label>
                <input
                  type="number"
                  id="numToGenerate"
                  name="numToGenerate"
                  value={numToGenerate}
                  onChange={handleInputChange}
                  className={`form-control ${numToGenerateError ? 'is-invalid' : ''}`}
                />
              </div>
              <div className="valueInput mb-3">
                <label htmlFor="colorGrouping">Color Grouping: </label>
                <label className="labelExample" htmlFor="colorGroupingExample">ex: [1, 3, 4], [2, 5-7]</label>
                <input
                  type="text"
                  id="colorGrouping"
                  name="colorGrouping"
                  value={colorGrouping}
                  onChange={handleInputChange}
                  className={`form-control ${colorGroupingError ? 'is-invalid' : ''}`}
                />
              </div>
              <button onClick={handleGeneratePalette} className="btn btn-success">Generate Palettes</button>
              {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
            </div>
            <div className="image-upload-box col-md-9">
              <div className='col-md-12'>
                <label htmlFor="imageupload">Upload Image for Variation:</label>
                <ImageUpload variantImage={variantImage} setVariantImage={setVariantImage} uploadedImage={uploadedImage} setUploadedImage={setUploadedImage} />
              </div>
            </div>
          </div>
        </div>

        {/*Palette Outputs from flask*/}
        {generatedColorsVisible && (
          <div className="col-12">
            <div className="row">
              <div className="color-outputs">
                <h3>Variant Palettes:</h3>
              </div>
              {generatedColorsVisible && (
                <PaletteOutput
                  generatedPalettes={generatedPalettes}
                  selectedPaletteIndex={selectedPaletteIndex}
                  uploadedImage={uploadedImage}
                  handlePaletteClick={handlePaletteClick}
                  isAuthenticated={isAuthenticated}
                  showSaveButton={true}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePalettePage;
