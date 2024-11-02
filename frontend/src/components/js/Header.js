import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/Header.css';

const Header = ({ isAuthenticated, onLogout }) => {
  // Don't show if on login or signup page
  const location = useLocation();
  const excludedPaths = ['/login-page', '/sign-up'];
  const showAuthButton = !excludedPaths.includes(location.pathname);

  return (
    <header className="header bg-dark text-white p-3">
      <div className="header-content container">
        <h1 className="header-title">
          <Link to="/" className="text-white">
            Color Variant Generator
          </Link>
        </h1>
        <nav className="header-nav">
          {showAuthButton && (
            isAuthenticated ? (
              <button onClick={onLogout} className="btn btn-light">
                Logout
              </button>
            ) : (
              <Link to="/login-page" className="btn btn-light">
                Login
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
