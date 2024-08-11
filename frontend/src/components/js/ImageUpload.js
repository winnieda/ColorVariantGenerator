import React, { useState, useContext } from 'react';
import { PaletteContext } from './context/PaletteContext';

const ImageUpload = () => {
  const { paletteState, setPaletteState } = useContext(PaletteContext);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setPaletteState({ ...paletteState, uploadedImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-upload col-12">
      <input className="col-md-12" type="file" accept="image/*" onChange={handleImageChange} />
      <div className='image-input-output row'>
        <div className='image-container col-6'>
            {preview && <img src={preview} alt="Uploaded Preview" className="img-fluid" />}
        </div>
        <div className='image-container col-6'>
            {preview && <img src={preview} alt="Uploaded Preview" className="img-fluid" />}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
