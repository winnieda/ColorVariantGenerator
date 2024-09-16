import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/js/Header';
import Footer from './components/js/Footer';
import LandingPage from './components/js/LandingPage';
import CreatePalettePage from './components/js/CreatePalettePage';
import HowToUsePage from './components/js/HowToUsePage';
import PicturePresets from './components/js/PicturePresets';
import './App.css';

const App = () => {
  return (
    <Router>
      <Header />
      <div className="content">
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/create-palette" element={<CreatePalettePage />} />
          <Route path="/picture-presets" element={<PicturePresets />} />
          <Route path="/how-to-use" element={<HowToUsePage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
