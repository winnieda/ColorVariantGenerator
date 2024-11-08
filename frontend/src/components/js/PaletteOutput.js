import React, { useState, useEffect } from 'react';
import { ColorOutputBatch } from './ColorOutput';
import axios from 'axios';
import '../css/CreatePalettePage.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '/api';
// const apiBaseUrl = 'http://127.0.0.1:5000/api';

const PaletteOutput = ({
  generatedPalettes = [],
  selectedPaletteIndex = null,
  uploadedImage = null,
  handlePaletteClick = () => {},
  isAuthenticated = false,
  showSaveButton = false,
  isWide = false,
}) => {
  const [clickedIndexes, setClickedIndexes] = useState(new Set());
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    // Reset clickedIndexes when a new batch of palettes is generated
    setClickedIndexes(new Set());
  }, [generatedPalettes]);

  const handleSaveClick = async (index) => {
    if (!isAuthenticated) {
      alert("You are not logged in. Please log in to save palettes.");
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/save_palette`, {
        palette_data: { colors: generatedPalettes[index] }
      }, { withCredentials: true });

      if (response.status === 201) {
        alert(`Saved Palette ${index + 1} to profile!`);
        setClickedIndexes((prevClickedIndexes) => new Set(prevClickedIndexes).add(index));
      } else {
        alert("Failed to save palette. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please log in again.");
      } else {
        console.error("Error saving palette:", error);
        alert("An error occurred while saving the palette. Please try again.");
      }
    }
  };

  const handleMouseEnter = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);

  return (
    <div className="col-12">
      <div className="row">
        {generatedPalettes.map((palette, index) => (
          <div
            key={index}
            className={`palette-output col-sm-12 col-md-6 ${uploadedImage && selectedPaletteIndex !== index ? 'hoverable' : ''} ${selectedPaletteIndex === index ? 'selected' : ''}`}
            onClick={() => uploadedImage && handlePaletteClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="palette-label col-12">
              Palette {index + 1}
              {isAuthenticated && showSaveButton && hoveredIndex === index && !clickedIndexes.has(index) && (
                <div className="save-button-container">
                  <button className="save-button" onClick={(e) => {
                    e.stopPropagation();
                    handleSaveClick(index);
                  }}>
                    <i className="fas fa-save"></i>
                  </button>
                </div>
              )}
            </div>
            <ColorOutputBatch palette={palette} wide={isWide} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaletteOutput;
