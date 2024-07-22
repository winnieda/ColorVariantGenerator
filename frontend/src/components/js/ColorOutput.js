import React from 'react';
import '../css/ColorOutput.css'; // Import the CSS file for styling

const rgbToHex = (rgb) => {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

const ColorOutput = ({ color }) => {
  const hexValue = rgbToHex(color);
  const rgbValue = color.match(/\d+/g).join(", ");
  
  return (
    <div className="color-output-container">
      <div className="color-box" style={{ backgroundColor: color }}></div>
      <div className="color-info">
        {hexValue}
        <br />
        [{rgbValue}]
      </div>
    </div>
  );
};

const ColorOutputBatch = ({ colors }) => {
  return (
    <div className="color-output-batch">
      {colors.map((color, index) => (
        <ColorOutput key={index} color={color} />
      ))}
    </div>
  );
};

export { ColorOutput, ColorOutputBatch };
