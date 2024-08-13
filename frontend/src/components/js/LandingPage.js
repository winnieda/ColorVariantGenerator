import React from 'react';
import { Link } from 'react-router-dom';
import '../css/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="container text-center mt-5">
      <div className="row justify-content-center">
        <div className="col-12 landing-header mb-4">
          <h2>Welcome to the Color Variant Generator</h2>
          <p className="lead">Click an option below to get started:</p>
        </div>
        <div className="col-12 landing-buttons">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-9 mb-3">
              <Link to="/create-palette" className="btn btn-primary btn-lg w-100">
                <i className="fas fa-palette"></i> Create Palette or Variants
              </Link>
            </div>            
            <div className="col-md-4 col-lg-3 mb-3">
              <Link to="/picture-presets" className="btn btn-secondary btn-lg w-100">
                <i className="fas fa-image"></i> Picture Presets
              </Link>
            </div>
            <div className="col-md-4 col-lg-3 mb-3">
              <Link to="/how-to-use" className="btn btn-secondary btn-lg w-100">
                <i className="fas fa-question"></i> How to Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
