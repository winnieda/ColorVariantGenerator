import React, { useState } from 'react';

const ColorInput = ({ id, removeColor }) => {
  const [hex, setHex] = useState('');
  const [rgb, setRgb] = useState({ r: '', g: '', b: '' });

  const handleHexChange = (e) => {
    setHex(e.target.value);
    // We will handle RGB conversion later
  };

  const handleRgbChange = (e) => {
    const { name, value } = e.target;
    setRgb({ ...rgb, [name]: value });
    // We will handle Hex conversion later
  };

  return (
    <div className="color-input">
      <label>Color {id + 1}:</label>
      <input
        type="text"
        value={hex}
        onChange={handleHexChange}
        placeholder="Hex"
        maxLength={7}
      />
      <input
        type="number"
        name="r"
        value={rgb.r}
        onChange={handleRgbChange}
        placeholder="R"
        min="0"
        max="255"
      />
      <input
        type="number"
        name="g"
        value={rgb.g}
        onChange={handleRgbChange}
        placeholder="G"
        min="0"
        max="255"
      />
      <input
        type="number"
        name="b"
        value={rgb.b}
        onChange={handleRgbChange}
        placeholder="B"
        min="0"
        max="255"
      />
      <button onClick={() => removeColor(id)}>Remove</button>
    </div>
  );
};

export default ColorInput;
