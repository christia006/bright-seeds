import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header'; // Perbaikan path
import { getCurrentUser } from '../../services/authService';
import styles from './Dashboard.module.css'; // Import CSS Module

const Dashboard = ({ currentUser, setCurrentUser }) => {
  const [user, setUser] = useState(currentUser);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    } else {
      const storedUser = getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
        setCurrentUser(storedUser);
      }
    }
  }, [currentUser, setCurrentUser]);

  if (!user) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.contentArea} style={{marginTop: '80px', textAlign: 'center'}}>
          <p>Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  const getLevelDisplay = (activityProgress) => {
    if (activityProgress && activityProgress.level) {
      return `Level ${activityProgress.level} ✨`;
    }
    if (activityProgress && activityProgress.completed && activityProgress.completed.length > 0) {
        return `Sudah Mulai! ⭐`;
    }
    return `Mulai Belajar! 🚀`;
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.dashboardContent}> {/* Gunakan styles.dashboardContent */}
        <h2 className={styles.welcomeMessage}>
          Halo, {user.username}!👋 Ayo kita belajar dan bermain!
        </h2>

        <div className={styles.activityGrid}>
          <Link to="/read" className={`${styles.activityCard} ${styles.readingCard}`}>
            <div className={styles.cardIcon}>📖</div>
            <h3>Membaca</h3>
            <p>{getLevelDisplay(user.progress?.reading)}</p>
          </Link>

          <Link to="/write" className={`${styles.activityCard} ${styles.writingCard}`}>
            <div className={styles.cardIcon}>✍️</div>
            <h3>Menulis</h3>
            <p>{getLevelDisplay(user.progress?.writing)}</p>
          </Link>

          <Link to="/math" className={`${styles.activityCard} ${styles.mathCard}`}>
            <div className={styles.cardIcon}>➕</div>
            <h3>Matematika</h3>
            <p>{getLevelDisplay(user.progress?.math)}</p>
          </Link>

          <Link to="/games" className={`${styles.activityCard} ${styles.gamesCard}`}>
            <div className={styles.cardIcon}>🎮</div>
            <h3>Game</h3>
            <p>Waktunya bermain seru! 🎉</p>
          </Link>

          <Link to="/profile" className={`${styles.activityCard} ${styles.profileCard}`}>
            <div className={styles.cardIcon}>👤</div>
            <h3>Profilku</h3>
            <p>Lihat progresmu di sini! 📈</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;