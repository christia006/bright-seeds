import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import styles from './Dashboard.module.css'; // Menggunakan CSS Modules

// Error Boundary sederhana
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("Error caught in ErrorBoundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong while loading part of the page.</h2>;
    }
    return this.props.children;
  }
}

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // State dan Ref untuk Musik Latar Belakang
  const [isPlaying, setIsPlaying] = useState(true);
  const backgroundAudioRef = useRef(null); // Changed name for clarity

  // Ref untuk Suara Klik Tombol/Kartu
  const clickAudioRef = useRef(null);

  // Efek samping untuk inisialisasi audio latar belakang dan mengelola putar/jeda
  useEffect(() => {
    // Inisialisasi objek Audio latar belakang hanya sekali saat komponen dimuat
    if (!backgroundAudioRef.current) {
      backgroundAudioRef.current = new Audio('/sound/kids.mp3'); // Pastikan path ini benar
      backgroundAudioRef.current.loop = true; // Putar musik secara berulang
      backgroundAudioRef.current.volume = 0.5; // Atur volume awal
    }

    // Mengontrol putar/jeda berdasarkan state isPlaying
    if (isPlaying) {
      backgroundAudioRef.current.play().catch(e => console.error("Gagal memutar audio latar belakang:", e));
    } else {
      backgroundAudioRef.current.pause();
    }

    // Membersihkan efek samping saat komponen dilepas
    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current = null; // Hapus referensi audio
      }
    };
  }, [isPlaying]); // Bergantung pada isPlaying agar efek berjalan saat status berubah

  // Efek samping untuk inisialisasi suara klik
  useEffect(() => {
    // Inisialisasi objek Audio untuk suara klik hanya sekali
    if (!clickAudioRef.current) {
      clickAudioRef.current = new Audio('/sound/tombol.mp3'); // Pastikan path ini benar
      clickAudioRef.current.volume = 0.8; // Atur volume untuk suara klik
    }
  }, []); // Berjalan hanya sekali saat komponen dipasang

  // Fungsi untuk mengaktifkan/menonaktifkan musik latar belakang
  const toggleMusic = () => {
    setIsPlaying(prev => !prev);
  };

  // Fungsi untuk memutar suara klik
  const playClickSound = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0; // Setel ulang ke awal jika sudah diputar
      clickAudioRef.current.play().catch(e => console.error("Gagal memutar suara klik:", e));
    }
  };

  useEffect(() => {
    // Dummy user data
    const dummyUser = {
      username: "Temanku",
      progress: {
        reading: { level: 1 },
        writing: { level: 1 },
        math: { level: 1 },
        games: {
          patternScanner: { highscore: 0, level: "Mudah" },
          memoryTrainer: { highscore: 0, level: "Mudah" },
          puzzleSyaratGanda: { highscore: 0, level: "Mudah" },
          kodeRahasia: { highscore: 0, level: "Mudah" },
          pathFinder: { highscore: 0, level: "Mudah" } // Tambahkan progress untuk Path Finder
        },
        badges: []
      }
    };
    setUser(dummyUser);
  }, []);

  const handleLogout = () => {
    playClickSound(); // Play sound on logout button click
    navigate('/'); // kembali ke halaman utama (LandingPage)
  };

  // Saat data user belum siap
  if (!user) {
    return (
      <div className={styles.pageContainer}>
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
        <div className={styles.contentArea} style={{ marginTop: '80px', textAlign: 'center' }}>
          <p>Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      <div className={styles.dashboardContent}>
        <h2 className={styles.welcomeMessage}>
          Halo, {user.username}! 👋 Ayo kita belajar dan bermain!
        </h2>

        <div className={styles.activityGrid}>
          {/* Membaca */}
          <Link to="/read" className={`${styles.activityCard} ${styles.readingCard}`} onClick={playClickSound}>
            <div className={styles.cardIcon} aria-hidden="true">📖</div>
            <h3>Membaca</h3>
            <p>Ayo kenali huruf dan kata! 📚</p>
          </Link>

          {/* Menulis */}
          <Link to="/write" className={`${styles.activityCard} ${styles.writingCard}`} onClick={playClickSound}>
            <div className={styles.cardIcon} aria-hidden="true">✍️</div>
            <h3>Menulis</h3>
            <p>Yuk, belajar menulis namamu! ✏️</p>
          </Link>

          {/* Matematika */}
          <Link to="/math" className={`${styles.activityCard} ${styles.mathCard}`} onClick={playClickSound}>
            <div className={styles.cardIcon} aria-hidden="true">➕</div>
            <h3>Matematika</h3>
            <p>Mari berhitung angka seru! 🔢</p>
          </Link>

          {/* Game */}
          <Link to="/games" className={`${styles.activityCard} ${styles.gamesCard}`} onClick={playClickSound}>
            <div className={styles.cardIcon} aria-hidden="true">🎮</div>
            <h3>Game</h3>
            <p>Waktunya bermain seru! 🎉</p>
          </Link>

          {/* Path Finder (NEW) */}
          <Link to="/pathfinder" className={`${styles.activityCard} ${styles.pathFinderCard}`} onClick={playClickSound}>
            <div className={styles.cardIcon} aria-hidden="true">🗺️</div>
            <h3>Path Finder</h3>
            <p>Temukan jalan terpendek di labirin yang rumit!</p>
          </Link>

          {/* Wumpus World */}
          <Link to="/wumpus-world" className={`${styles.activityCard} ${styles.miniAIChessCard}`} onClick={playClickSound}>
            <div className={styles.cardIcon} aria-hidden="true">🏰</div>
            <h3>Wumpus World Deluxe</h3>
            <p>Lab AI klasik yang melatih penalaran & perencanaan!</p>
          </Link>


      

      
        </div>

        {/* Grup Tombol Logout dan Sound */}
        <div className={styles.buttonGroup}>
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
            aria-label="Keluar"
          >
            Keluar <span role="img" aria-label="exit">🚪</span>
          </button>
          <button
            onClick={() => {
              toggleMusic();
              playClickSound(); // Play sound when toggling music as well
            }}
            className={styles.musicToggleButton}
            aria-label={isPlaying ? "Matikan Musik" : "Putar Musik"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.586L18 21.414V2.586L5.586 8.414m0 0a2 2 0 100 2.828 2 2 0 000-2.828z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 0120 10a8 8 0 01-3.707-6.707M12 17.293A8 8 0 019 20a8 8 0 01-3.707-6.707M12 12V3m0 9a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
