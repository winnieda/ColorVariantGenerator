import React, { useState, useContext } from 'react';
import { PaletteContext } from './context/PaletteContext';

const ImageUpload = ({ variantImage }) => {
  const { paletteState, setPaletteState } = useContext(PaletteContext);
  const [originalPicture, setOriginalPicture] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      try {
        reader.onloadend = () => {
          setOriginalPicture(reader.result);
          setPaletteState({ ...paletteState, uploadedImage: reader.result, variantImage: null });
        };
      } catch {
        alert("Image Upload Failed. Your image might be too large");
      }
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-upload col-12">
      <input className="col-md-12" type="file" accept="image/*" onChange={handleImageChange} />
      <div className='image-input-output row col-12'>
        <div id="original-picture" className='image-container col-6'>
            {originalPicture && <img src={originalPicture} alt="Original Image" className="img-fluid" />}
        </div>
        <div id="changed-picture" className='image-container col-6'>
            {variantImage && <img src={variantImage} alt="Variant Image" className="img-fluid" />}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
