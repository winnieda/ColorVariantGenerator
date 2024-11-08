import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';
import { Link } from 'react-router-dom';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '/api';
// const apiBaseUrl = 'http://127.0.0.1:5000/api';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Both username and password are required');
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/login`, {
        username,
        password,
      }, { withCredentials: true });

      setError(null);
      onLogin(response.data.username, response.data.id);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin}>
        <h2>Log In</h2>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={!username || !password}>
          Login
        </button>
        <p className="signup-link-text">
          or <Link to="/sign-up" className="signup-link">Sign Up</Link> if you don't have an account
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
