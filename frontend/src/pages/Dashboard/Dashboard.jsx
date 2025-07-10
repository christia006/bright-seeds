import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import styles from './Dashboard.module.css';

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
          <Link to="/read" className={`${styles.activityCard} ${styles.readingCard}`}>
            <div className={styles.cardIcon} aria-hidden="true">📖</div>
            <h3>Membaca</h3>
            <p>Ayo kenali huruf dan kata! 📚</p>
          </Link>

          {/* Menulis */}
          <Link to="/write" className={`${styles.activityCard} ${styles.writingCard}`}>
            <div className={styles.cardIcon} aria-hidden="true">✍️</div>
            <h3>Menulis</h3>
            <p>Yuk, belajar menulis namamu! ✏️</p>
          </Link>

          {/* Matematika */}
          <Link to="/math" className={`${styles.activityCard} ${styles.mathCard}`}>
            <div className={styles.cardIcon} aria-hidden="true">➕</div>
            <h3>Matematika</h3>
            <p>Mari berhitung angka seru! 🔢</p>
          </Link>

          {/* Game */}
          <Link to="/games" className={`${styles.activityCard} ${styles.gamesCard}`}>
            <div className={styles.cardIcon} aria-hidden="true">🎮</div>
            <h3>Game</h3>
            <p>Waktunya bermain seru! 🎉</p>
          </Link>

          {/* Path Finder (NEW) */}
          <Link to="/pathfinder" className={`${styles.activityCard} ${styles.pathFinderCard}`}>
            <div className={styles.cardIcon} aria-hidden="true">🗺️</div>
            <h3>Path Finder</h3>
            <p>Temukan jalan terpendek di labirin yang rumit!</p>
          </Link>

        

           <Link to="/wumpus-world" className={`${styles.activityCard} ${styles.miniAIChessCard}`}>
            <div className={styles.cardIcon} aria-hidden="true">🏰</div>
            <h3>Wumpus World Deluxe</h3>
            <p>Lab AI klasik yang melatih penalaran & perencanaan!</p>
          </Link>


         
        </div>

        <button
          onClick={handleLogout}
          className={styles.logoutButton}
          aria-label="Keluar"
        >
          Keluar <span role="img" aria-label="exit">🚪</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
