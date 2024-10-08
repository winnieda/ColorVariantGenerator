import React from 'react';
import '../css/ColorInput.css';

const ColorInput = ({ id, hex, r, g, b, isValid, onInputChange, removeColor, onEyedropperClick }) => {
  const handleInputChange = (field, value) => {
    onInputChange(id, field, value);
  };

  return (
    <div className={`color-input col-12 ${isValid === false ? 'is-invalid' : ''}`}>
      <label className='color-label'>
        Color {id + 1}:
      </label>
      <div className="input-container">
        <input
          type="text"
          value={hex}
          onChange={(e) => handleInputChange('hex', e.target.value)}
          placeholder="Hex"
          className={`form-control hex-input ${isValid === false ? 'is-invalid' : ''}`}
        />
        <input
          type="number"
          value={r}
          onChange={(e) => handleInputChange('r', e.target.value)}
          placeholder="R"
          min="0"
          max="255"
          className={`form-control rgb-input ${isValid === false ? 'is-invalid' : ''}`}
        />
        <input
          type="number"
          value={g}
          onChange={(e) => handleInputChange('g', e.target.value)}
          placeholder="G"
          min="0"
          max="255"
          className={`form-control rgb-input ${isValid === false ? 'is-invalid' : ''}`}
        />
        <input
          type="number"
          value={b}
          onChange={(e) => handleInputChange('b', e.target.value)}
          placeholder="B"
          min="0"
          max="255"
          className={`form-control rgb-input ${isValid === false ? 'is-invalid' : ''}`}
        />
        <button onClick={() => onEyedropperClick(id)} className="eyedropper-button">
          <i className="fas fa-eye-dropper"></i>
        </button>
      </div>
      <button onClick={() => removeColor(id)} className="btn btn-danger">Remove</button>
    </div>
  );
};

export default ColorInput;
