import React, { useState } from 'react';
import ColorInput from './ColorInput';
import { ColorOutputBatch } from './ColorOutput';
import '../css/CreatePalettePage.css'; // Import CSS file for later use

const CreatePalettePage = () => {
  const [colors, setColors] = useState([{ id: 0 }]);

  const addColor = () => {
    setColors([...colors, { id: colors.length }]);
  };

  const removeColor = (id) => {
    setColors(colors.filter((color) => color.id !== id));
  };

  const placeholderColors1 = ["rgb(255, 87, 51)", "rgb(51, 255, 87)", "rgb(51, 87, 255)"];
  const placeholderColors2 = ["rgb(255, 195, 0)", "rgb(0, 195, 255)", "rgb(195, 0, 255)"];

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 mb-4">
          <div className="color-inputs">
            {colors.map((color) => (
              <ColorInput key={color.id} id={color.id} removeColor={removeColor} />
            ))}
          </div>
          <button onClick={addColor} className="add-color-btn">+ Add Color</button>
        </div>
        <div className="col-12 mb-4">
          <div className="row">
            <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="variance">Variance:</label>
                <input type="number" id="variance" name="variance" className="form-control" />
              </div>
              <div className="mb-3">
                <label htmlFor="numToGenerate">Number of Colors to Generate:</label>
                <input type="number" id="numToGenerate" name="numToGenerate" className="form-control" />
              </div>
              <button className="btn btn-success">Generate Palette</button>
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
            <h3>Generated Colors:</h3>
            <ColorOutputBatch colors={placeholderColors1} />
            <ColorOutputBatch colors={placeholderColors2} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePalettePage;
