import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';
import GamesPage from './pages/GamesPage/GamesPage';
import MathPage from './pages/MathPage/MathPage';
import ReadingPage from './pages/ReadingPage/ReadingPage';
import WritingPage from './pages/WritingPage/WritingPage';
import PathFinderPage from './pages/PathFinderPage/PathFinderPage';
import WumpusWorldPage from './pages/WumpusWorldPage/WumpusWorldPage'; // Pastikan path ini benar

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/math" element={<MathPage />} />
        <Route path="/read" element={<ReadingPage />} />
        <Route path="/write" element={<WritingPage />} />
        <Route path="/pathfinder" element={<PathFinderPage />} />
        <Route path="/wumpus-world" element={<WumpusWorldPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;
