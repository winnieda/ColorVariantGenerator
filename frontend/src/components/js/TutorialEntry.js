import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TutorialEntry = ({ title, img, description }) => {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <h2 className="font-weight-bold">{title}</h2>
      </div>
      <div className="col-md-6 col-12">
        <img src={`/images/tutorial/${img}`} alt={title} className="img-fluid tutorial-image" />
      </div>
      <div className="col-md-6 col-12">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default TutorialEntry;
