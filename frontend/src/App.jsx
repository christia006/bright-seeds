// brightseeds-app/frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import Dashboard from './pages/Dashboard/Dashboard'; // Import komponen Dashboard
import { getCurrentUser, logout } from './services/authService';
// ... import halaman lain

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    // Otomatis navigasi ke dashboard setelah login
    // Karena useNavigate hanya bisa dipakai di dalam Router context
    // Kita bisa pakai Link di LoginPage, atau pakai useNavigate jika LoginPage adalah bagian dari Routes
    // atau kita bisa lakukan ini di komponen App itu sendiri
    // Untuk saat ini, kita asumsikan LoginPage sudah menangani navigasi ke dashboard
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    // Setelah logout, arahkan ke landing page
    // navigate('/'); // Ini perlu ada di dalam komponen yang di-render di dalam Router
  };

  return (
    <Router>
      {/* Anda bisa pass currentUser ke Header juga jika ingin menampilkan nama pengguna atau tombol logout */}
      <Routes>
        <Route path="/" element={<LandingPage currentUser={currentUser} />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Rute ke Dashboard */}
        <Route path="/dashboard" element={currentUser ? <Dashboard currentUser={currentUser} onLogout={handleLogout} /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
        {/* Tambahkan rute lain di sini (ReadingPage, WritingPage, dll.) */}
        {/* Contoh protected route (harus login dulu) */}
        {/* <Route 
            path="/reading" 
            element={currentUser ? <ReadingPage currentUser={currentUser} /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} 
        /> */}
      </Routes>
    </Router>
  );
};

export default App;