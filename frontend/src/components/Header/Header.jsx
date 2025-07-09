import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService'; // Make sure this path is correct
import styles from './Header.module.css'; // Import CSS Module

const Header = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null); // Ref for detecting clicks outside the menu

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
    }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

    const handleLogout = () => {
        localStorage.removeItem('currentUser'); // Clear user from local storage
        setCurrentUser(null); // Clear user from state
        setIsMenuOpen(false); // Close the menu
        navigate('/'); // Redirect to the landing page
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    return (
        <header className={styles.header}>
            <div className={styles.appName}>
                <Link to="/" className={styles.appLink}>BrightSeeds 🌱</Link>
            </div>

            {currentUser ? ( // If a user is logged in, show the menu button
                <div className={styles.menuContainer} ref={menuRef}>
                    <button onClick={toggleMenu} className={styles.menuButton}>
                        <span role="img" aria-label="menu icon" className={styles.menuIcon}>☰</span>
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
            ) : ( // If no user is logged in, show login/register buttons
                <div className={styles.authButtons}>
                   
                </div>
            )}
        </header>
    );
};

export default Header;