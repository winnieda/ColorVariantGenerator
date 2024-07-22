import React from 'react';
import { Link } from 'react-router-dom';
import '../css/LandingPage.css'; // Import the CSS file for custom styling

const LandingPage = () => {
  return (
    <div className="container text-center mt-5">
      <div className="row justify-content-center">
        <div className="col-12 landing-header mb-4">
          <h2>Welcome to the Color Variant Generator</h2>
          <p className="lead">Create stunning color palettes and picture variations with ease.</p>
        </div>
        <div className="col-12 landing-buttons">
          <div className="row justify-content-center">
            <div className="col-md-5 mb-3">
              <Link to="/create-palette" className="btn btn-primary btn-lg w-100">
                <i className="fas fa-palette"></i> Create new Palette
              </Link>
            </div>
            <div className="col-md-5 mb-3">
              <Link to="/create-picture-variations" className="btn btn-secondary btn-lg w-100">
                <i className="fas fa-image"></i> Create Picture Variations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
