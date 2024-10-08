const ImageUpload = ({ variantImage, setVariantImage, uploadedImage, setUploadedImage}) => {

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      try {
        reader.onloadend = () => {
          setUploadedImage(reader.result);
          setVariantImage(null);
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
            {uploadedImage && <img src={uploadedImage} alt="Original" className="img-fluid" />}
        </div>
        <div id="changed-picture" className='image-container col-6'>
            {variantImage && <img src={variantImage} alt="Variant" className="img-fluid" />}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
