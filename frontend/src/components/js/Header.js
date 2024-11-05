import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';

// Note: In a more serious situation find way to make authenticated
// and username accessible anywhere
const Header = ({ isAuthenticated, username, userId, onLogout }) => {
  return (
    <header className="header bg-dark text-white p-3">
      <div className="header-content container">
        <h1 className="header-title">
          <Link to="/" className="text-white">
            Color Variant Generator
          </Link>
        </h1>
        <nav className="header-nav">
          {isAuthenticated && (
            <>
              <span className="username-display">Logged in as {username}</span>
              <Link to={`/user/${userId}`} className="btn btn-light mx-2">
                Profile
              </Link>
              <button onClick={onLogout} className="btn btn-light">
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <Link to="/login-page" className="btn btn-light">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;