import React from 'react';
import '../css/ColorOutput.css';

const ColorOutput = ({ hex, wide }) => {

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

  // Just return here if it's not valid hex
  if (!(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex))){
    return (<div></div>);
  }

  const [r, g, b] = hexToRgb(hex);

  const columns = wide ? "col-sm-6 col-md-3 col-lg-2" : "col-md-6 col-lg-4";

  return (
  <div className={`color-output-container ${columns}`}>
    <div className="color-box" style={{ backgroundColor: hex }}></div>
      <div className="color-info">
        <div>{hex}</div>
        <div>[{r}, {g}, {b}]</div>
      </div>
    </div>
  );
};

export const ColorOutputBatch = ({ palette, wide }) => {
  return palette ? (
    <div className="color-output-batch col-12">
      {palette.map((color, index) => (
        <ColorOutput key={index} hex={color} wide={wide} />
      ))}
    </div>
  ) : (<div></div>);
};

export default ColorOutput;
