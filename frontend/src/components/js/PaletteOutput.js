import React, { useState, useEffect } from 'react';
import { ColorOutputBatch } from './ColorOutput';
import '../css/CreatePalettePage.css';

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

  const handleSaveClick = (index) => {
    alert(`Saved Palette ${index + 1} to profile!`);
    setClickedIndexes((prevClickedIndexes) => new Set(prevClickedIndexes).add(index));
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
