import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';

// Import semua komponen halaman Anda dari sub-folder baru
// PASTIKAN NAMA FOLDER DAN FILE SESUAI DENGAN HURUF BESAR/KECIL
import Header from './components/Header/Header';
import LandingPage from './pages/LandingPage/LandingPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import Dashboard from './pages/Dashboard/Dashboard';
import ReadingPage from './pages/ReadingPage/ReadingPage';
import WritingPage from './pages/WritingPage/WritingPage';
import MathPage from './pages/MathPage/MathPage';
import GamesPage from './pages/GamesPage/GamesPage'; // PERUBAHAN PATH INI
import ProfilePage from './pages/ProfilePage/ProfilePage'; // PERUBAHAN PATH INI

// Import service dan komponen tambahan
import { getCurrentUser } from './services/authService';
import LoadingSpinner from './components/LoadingSpinner';

/**
 * ProtectedRoute Component
 * Wrapper untuk melindungi rute.
 * Jika pengguna tidak login, akan dialihkan ke halaman login.
 */
const ProtectedRoute = ({ children, currentUser }) => {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage currentUser={currentUser} />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <Dashboard currentUser={currentUser} setCurrentUser={setCurrentUser} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/read"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <ReadingPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/write"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <WritingPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/math"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <MathPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/games"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <GamesPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <ProfilePage currentUser={currentUser} onLogout={handleLogout} setCurrentUser={setCurrentUser} />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;