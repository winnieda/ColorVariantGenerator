import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '/api';
// const apiBaseUrl = 'http://127.0.0.1:5000/api';

const TwoFactorPage = ({ onLogin }) => {
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve username from localStorage
    const storedUsername = localStorage.getItem('usernameFor2FA');
    if (!storedUsername) {
      // Redirect back to login if username is not found
      navigate('/login-page');
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiBaseUrl}/validate-2fa`, {
        username,
        code: twoFactorCode,
      }, { withCredentials: true });

      setError(null);
      onLogin(username, response.data.id);
      navigate('/'); // Redirect to the home page on success
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid 2FA code. Please try again.');
    }
  };

  return (
    <div className="two-factor-page">
      <form onSubmit={handleSubmit}>
        <h2>Two-Factor Authentication</h2>
        <p>Enter the 2FA code sent to your email to continue.</p>
        <div className="form-group">
          <label>2FA Code</label>
          <input
            type="text"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={!twoFactorCode}>
          Verify Code
        </button>
      </form>
    </div>
  );
};

export default TwoFactorPage;
