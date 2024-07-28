import React from 'react';
import '../css/ColorOutput.css';

const ColorOutput = ({ hex }) => {
  console.log('hex:', hex)

  const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
     ] : null;
  };
  
  var reg=/^#([0-9a-f]{3}){1,2}$/i;
  if (!reg.test(hex)){
    return;
  }

  const [r, g, b] = hexToRgb(hex);

  return (
    <div className="color-output-container">
      <div className="color-box" style={{ backgroundColor: hex }}></div>
      <div className="color-info">
        <div>{hex}</div>
        <div>[{r}, {g}, {b}]</div>
      </div>
    </div>
  );
};

export const ColorOutputBatch = ({ palette }) => {
  console.log('palette:', palette);
  return palette ? (
    <div className="color-output-batch">
      {palette.map((color, index) => (
        <ColorOutput key={index} hex={color} />
      ))}
    </div>
  ) : (<div></div>);
};

export default ColorOutput;
