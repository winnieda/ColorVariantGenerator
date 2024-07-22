import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/js/Header';
import Footer from './components/js/Footer';
import LandingPage from './components/js/LandingPage';
import CreatePalettePage from './components/js/CreatePalettePage';
import './App.css'; // Import the CSS file for general styling

const App = () => {
  return (
    <Router>
      <Header />
      <div className="content">
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/create-palette" element={<CreatePalettePage />} />
          <Route path="/create-picture-variations" element={<div>Create Picture Variations Page</div>} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
