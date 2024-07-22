import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css'; // Import the CSS file for header styling

const Header = () => {
  return (
    <header className="bg-dark text-white p-3">
      <div className="container">
        <h1>
          <Link to="/" className="text-white">
            Color Variant Generator
          </Link>
        </h1>
      </div>
    </header>
  );
};

export default Header;
