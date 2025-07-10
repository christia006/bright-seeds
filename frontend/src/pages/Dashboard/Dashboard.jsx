import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Buat user dummy langsung di sini
    // In a real application, you would fetch user data from an API or context
    const dummyUser = {
      username: "Temanku", // Nama pengguna yang ramah anak
      progress: {
        // Progres tetap ada di sini jika diperlukan untuk fitur lain di masa depan,
        // tetapi tidak akan ditampilkan sebagai "level" di UI ini.
        reading: { level: 1 },
        writing: { level: 1 },
        math: { level: 1 },
        games: {
          patternScanner: { highscore: 0, level: "Mudah" },
          memoryTrainer: { highscore: 0, level: "Mudah" },
          puzzleSyaratGanda: { highscore: 0, level: "Mudah" },
          kodeRahasia: { highscore: 0, level: "Mudah" }
        },
        badges: []
      }
    };
    setUser(dummyUser);
  }, []);

  // Fungsi getLevelDisplay dihapus karena tidak lagi digunakan

  // Handler untuk tombol "Keluar" (Logout)
  const handleLogout = () => {
    // Di aplikasi nyata, Anda akan melakukan logika logout di sini (misalnya, menghapus token, keluar dari Firebase)
    // Untuk contoh dummy ini, kita hanya menavigasi ke LandingPage
    navigate('/'); // Navigasi ke path root, mengasumsikan LandingPage dipetakan di sana
  };

  // Tampilkan pesan memuat saat data pengguna sedang disiapkan
  if (!user) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.contentArea} style={{ marginTop: '80px', textAlign: 'center' }}>
          <p>Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.dashboardContent}>
        <h2 className={styles.welcomeMessage}>
          Halo, {user.username}! 👋 Ayo kita belajar dan bermain!
        </h2>

        <div className={styles.activityGrid}>
          {/* Kartu Membaca */}
          <Link to="/read" className={`${styles.activityCard} ${styles.readingCard}`}>
            <div className={styles.cardIcon}>📖</div>
            <h3>Membaca</h3>
            <p>Ayo kenali huruf dan kata! 📚</p> {/* Teks baru yang menarik */}
          </Link>

          {/* Kartu Menulis */}
          <Link to="/write" className={`${styles.activityCard} ${styles.writingCard}`}>
            <div className={styles.cardIcon}>✍️</div>
            <h3>Menulis</h3>
            <p>Yuk, belajar menulis namamu! ✏️</p> {/* Teks baru yang menarik */}
          </Link>

          {/* Kartu Matematika */}
          <Link to="/math" className={`${styles.activityCard} ${styles.mathCard}`}>
            <div className={styles.cardIcon}>➕</div>
            <h3>Matematika</h3>
            <p>Mari berhitung angka seru! 🔢</p> {/* Teks baru yang menarik */}
          </Link>

          {/* Kartu Game */}
          <Link to="/games" className={`${styles.activityCard} ${styles.gamesCard}`}>
            <div className={styles.cardIcon}>🎮</div>
            <h3>Game</h3>
            <p>Waktunya bermain seru! 🎉</p>
          </Link>

          {/* Kartu "Profilku" telah dihapus sesuai permintaan */}
        </div>

        {/* Tombol "Keluar" (Logout) */}
        <button
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Keluar <span role="img" aria-label="exit">🚪</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
