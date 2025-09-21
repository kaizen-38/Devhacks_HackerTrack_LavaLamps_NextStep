// FILE: src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Pages
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
// import InputFormPage from './pages/';
// You can create a placeholder for the next page
import InputFormPage from './pages/InputFormPage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/input-form" element={<InputFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;