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
import UserProfile from './components/js/UserProfile';
import NotFound from './components/js/NotFound';

const apiBaseUrl = 'http://127.0.0.1:5000';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);  
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/check-session`, { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
        if (response.data.isAuthenticated) {
          setUsername(response.data.username);
          console.log('checking session, response is: ', response.data);
          console.log('checking session, id is: ', response.data.id);
          setUserId(response.data.id);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setIsAuthenticated(false);
        setUsername(null); // Note that this shouldn't be necessary
        setUserId(null);
      }
    };
    checkSession();
  }, []);
   // On initial Load

   const handleLogin = (username_in, userID_in) => {
    setIsAuthenticated(true);
    setUsername(username_in);
    console.log('logging in, id is: ', userID_in);
    setUserId(userID_in);
  };  

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
      <Header isAuthenticated={isAuthenticated} username={username} userId={userId} onLogout={handleLogout} />
      <div className="content">
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/create-palette" element={<CreatePalettePage isAuthenticated={isAuthenticated} />} />
          <Route path="/picture-presets" element={<PicturePresets />} />
          <Route path="/how-to-use" element={<HowToUsePage />} />
          <Route path="/login-page" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/sign-up" element={<SignUpPage isAuthenticated={isAuthenticated} onLogin={handleLogin} />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
