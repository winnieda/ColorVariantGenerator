import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/SignUpPage.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
// const apiBaseUrl = 'http://127.0.0.1:5000';

const SignUpPage = ({ isAuthenticated, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirect to home if the user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic validation: ensure required fields are filled and passwords match
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Register the user
      const response = await axios.post(`${apiBaseUrl}/register`, {
        username,
        password,
        email: email || null,
      });

      // If registration is successful, log in the user automatically
      await axios.post(`${apiBaseUrl}/login`, {
        username,
        password,
      }, { withCredentials: true });

      // Call the onLogin function to set the app's isAuthenticated state to true
      console.log('signing up, response: ', response);
      onLogin(response.data.username, response.data.id);

      // Redirect to the home page
      navigate('/');

    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="sign-up-page">
      <form onSubmit={handleSignUp}>
        <h2>Sign Up</h2>
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
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={!username || !password || !confirmPassword}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
