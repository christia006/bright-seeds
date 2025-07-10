import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';
import GamesPage from './pages/GamesPage/GamesPage';
import MathPage from './pages/MathPage/MathPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ReadingPage from './pages/ReadingPage/ReadingPage';
import WritingPage from './pages/WritingPage/WritingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/math" element={<MathPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/read" element={<ReadingPage />} />
        <Route path="/write" element={<WritingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
