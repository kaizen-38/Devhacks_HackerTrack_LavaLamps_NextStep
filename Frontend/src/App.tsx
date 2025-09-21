// FILE: src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Pages
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import InputFormPage from './pages/InputFormPage';
import CareerPathPage from './pages/CareerPathPage';
import NotFoundPage from './pages/NotFoundPage';
import JobPage from './pages/JobPage';
import DashboardPage from './pages/DashboardPage';
import PomodoroPage from './pages/PomodoroPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/input-form" element={<InputFormPage />} />
        <Route path="/career-path" element={<CareerPathPage />} />
        <Route path="/job/:jobId" element={<JobPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pomodoro" element={<PomodoroPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

