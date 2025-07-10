// Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { getCurrentUser } from '../../services/authService';
import styles from './Header.module.css';

const Header = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const location = useLocation(); // Get current location

    // Effect to get current user on component mount
    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
    }, []);

    // Effect to close the menu when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('currentUser'); // Clear user from local storage
        setCurrentUser(null); // Clear user from state
        setIsMenuOpen(false); // Close the menu
        navigate('/'); // Redirect to the landing page
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    // Define the paths where Dashboard and Logout buttons should appear
    const allowedPathsForMenu = [
        '/games', // Assuming your GamesPage is at /games
        '/math',    // Assuming your MathPage is at /math
        '/reading', // Assuming your ReadingPage is at /reading
        '/writing'  // Assuming your WritingPage is at /writing
    ];

    // Check if the current path is in the allowedPathsForMenu array
    const shouldShowMenuButtons = allowedPathsForMenu.includes(location.pathname);

    return (
        <header className={styles.header}>
            <div className={styles.appName}>
                <Link to="/" className={styles.appLink}>BrightSeeds 🌱</Link>
            </div>

            {currentUser ? ( // If a user is logged in
                // Only show the menu container if the current page is one of the allowed pages
                shouldShowMenuButtons && (
                    <div className={styles.menuContainer} ref={menuRef}>
                        <button onClick={toggleMenu} className={styles.menuButton}>
                            <span role="img" aria-label="menu icon" className={styles.menuIcon}>☰</span>
                            <span className={styles.menuText}>Menu</span>
                        </button>

                        {isMenuOpen && (
                            <div className={styles.dropdownMenu}>
                                {/* Dashboard link will now always be visible when the menu itself is shown */}
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
                )
            ) : ( // If no user is logged in
                <div className={styles.authButtons}>
                    {/* Anda bisa menambahkan tombol Login/Register di sini jika tidak ada user yang login */}
                </div>
            )}
        </header>
    );
};

export default Header;