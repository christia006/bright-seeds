// brightseeds-app/frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard'; // Import komponen Dashboard
import { getCurrentUser, logout } from './services/authService';
// ... import halaman lain

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Saat buka root '/', langsung redirect ke dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard langsung bisa diakses */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Kalau ada rute lain, tambahkan di sini */}
        {/* Contoh: */}
        {/* <Route path="/reading" element={<ReadingPage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;