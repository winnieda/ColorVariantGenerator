import React from 'react';
import '../css/PicturePresetComponent.css';

const PicturePresetComponent = ({ image, colors, onClick }) => {
  return (
    <div className="picture-preset" onClick={onClick}>
      <img src={image} alt="Preset" />
      <div className="picture-preset-colors">
        {colors.map((color, index) => (
          <div key={index} style={{ backgroundColor: color }}></div>
        ))}
      </div>
    </div>
  );
};

export default PicturePresetComponent;
