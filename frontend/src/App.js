import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/js/Header';
import Footer from './components/js/Footer';
import LandingPage from './components/js/LandingPage';
import CreatePalettePage from './components/js/CreatePalettePage';
import HowToUsePage from './components/js/HowToUsePage';
import PicturePresets from './components/js/PicturePresets';
import LoginPage from './components/js/LoginPage';
import SignUpPage from './components/js/SignUpPage';
import './App.css';
import axios from 'axios';

const apiBaseUrl = 'http://127.0.0.1:5000';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/check-session`, { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("Session check failed:", error);
        setIsAuthenticated(false);
      }
    };
    checkSession();
  }, []); // On initial Load

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = async () => {
    try {
      await axios.post(`${apiBaseUrl}/logout`, {}, { withCredentials: true });
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="content">
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/create-palette" element={<CreatePalettePage isAuthenticated={isAuthenticated} />} />
          <Route path="/picture-presets" element={<PicturePresets />} />
          <Route path="/how-to-use" element={<HowToUsePage />} />
          <Route path="/login-page" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/sign-up" element={<SignUpPage isAuthenticated={isAuthenticated} onLogin={handleLogin} />} />
          </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
