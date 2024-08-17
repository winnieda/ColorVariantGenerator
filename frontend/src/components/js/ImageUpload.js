import React, { useState, useContext } from 'react';
import { PaletteContext } from './context/PaletteContext';

const ImageUpload = () => {
  const { paletteState, setPaletteState } = useContext(PaletteContext);
  const [originalPicture, setOriginalPicture] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalPicture(reader.result);
        setPaletteState({ ...paletteState, uploadedImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-upload col-12">
      <input className="col-md-12" type="file" accept="image/*" onChange={handleImageChange} />
      <div className='image-input-output row'>
        <div id="original-picture" className='image-container col-6'>
            {originalPicture && <img src={originalPicture} alt="Uploaded Preview" className="img-fluid" />}
        </div>
        <div id="changed-picture" className='image-container col-6'>
            {originalPicture && <img src={originalPicture} alt="Uploaded Preview" className="img-fluid" />}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
