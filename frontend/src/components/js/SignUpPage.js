import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/SignUpPage.css';

// const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '/api';
const apiBaseUrl = 'http://127.0.0.1:5000/api';

const SignUpPage = ({ isAuthenticated, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  // Redirect to home if the user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
        setError('Username and password are required');
        return;
    }
    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    try {
        // Send signup data to the server
        const response = await axios.post(`${apiBaseUrl}/register`, {
            username,
            password,
            email: email || null, // Include email or `null` if not provided
        });
        const { message, username: registeredUsername, id } = response.data;

        // Handle dynamic responses
        if (message.includes('No email provided')) {
            // Auto-login the user if no email is provided
            await axios.post(`${apiBaseUrl}/login`, {
                username,
                password,
            }, { withCredentials: true });

            onLogin(registeredUsername, id);
            navigate('/');
        } else if (message.includes('Email will be validated')) {
            navigate('/email-sent');
        }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';

      if (errorMessage === 'Email is already registered') {
          setError('The email is already in use. Please use a different email.');
      } else if (errorMessage === 'Username is already taken') {
          setError('The username is already taken. Please choose another.');
      } else {
          setError(errorMessage);
      }
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
          <label>Email (optional, sends confirmation email then enables 2FA)</label>
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
