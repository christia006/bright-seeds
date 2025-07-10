import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing page di root */}
        <Route path="/" element={<LandingPage />} />
        {/* Dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
