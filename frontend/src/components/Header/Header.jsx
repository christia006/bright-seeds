import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  // Mendapatkan user dari localStorage (atau sumber lain)
  useEffect(() => {
    try {
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Gagal membaca user dari localStorage:', error);
    }
  }, []);

  // Menutup menu jika klik di luar menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsMenuOpen(false);
    navigate('/'); // kembali ke landing page
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Halaman yang boleh menampilkan menu
  const allowedPathsForMenu = ['/games', '/math', '/reading', '/writing'];
  const shouldShowMenuButtons = allowedPathsForMenu.includes(location.pathname);

  return (
    <header className={styles.header}>
      <div className={styles.appName}>
        <Link to="/" className={styles.appLink}>BrightSeeds 🌱</Link>
      </div>

      {currentUser && shouldShowMenuButtons && (
        <div className={styles.menuContainer} ref={menuRef}>
          <button onClick={toggleMenu} className={styles.menuButton} aria-label="Menu">
            <span role="img" aria-hidden="true" className={styles.menuIcon}>☰</span>
            <span className={styles.menuText}>Menu</span>
          </button>

          {isMenuOpen && (
            <div className={styles.dropdownMenu}>
              <Link to="/dashboard" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                <span role="img" aria-label="dashboard" className={styles.itemIcon}>🏠</span> Dashboard
              </Link>
              <Link to="/profile" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                <span role="img" aria-label="profile" className={styles.itemIcon}>👤</span> Profilku
              </Link>
              <button onClick={handleLogout} className={styles.menuItem}>
                <span role="img" aria-label="logout" className={styles.itemIcon}>👋</span> Keluar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Jika tidak ada user, bisa tambahkan tombol login/register */}
      {!currentUser && (
        <div className={styles.authButtons}>
          {/* Contoh:
          <Link to="/login" className={styles.authButton}>Login</Link>
          <Link to="/register" className={styles.authButton}>Daftar</Link> 
          */}
        </div>
      )}
    </header>
  );
};

export default Header;
