import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header'; // Pastikan path sesuai struktur proyek
import styles from './ProfilePage.module.css'; // Import CSS Module

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // ← tambahkan ini

  useEffect(() => {
    // Dummy user data langsung di sini
    const dummyUser = {
      username: "Guest",
      progress: {
        reading: { level: 1, letters: ['a', 'b'], syllables: ['ba'], sentences: ['Ini kalimat'] },
        writing: { level: 1, letters: ['c'], words: ['cat'], sentences: ['Saya menulis'] },
        math: { level: 1, numbers: [1,2], counting: [3], arithmetic: [5] },
        games: {
          patternScanner: { highscore: 0, level: "Mudah" },
          memoryTrainer: { highscore: 0, level: "Mudah" },
          puzzleSyaratGanda: { highscore: 0, level: "Mudah" },
          kodeRahasia: { highscore: 0, level: "Mudah" }
        },
        badges: ["🌟 Pemula", "🎓 Belajar Rajin"]
      }
    };
    setUser(dummyUser);
  }, []);

  const handleLogout = () => {
    alert('Datang lagi ya...');
    navigate('/'); // ← redirect ke LandingPage
  };

  if (!user) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.contentArea}>
          <p className={styles.infoMessage}>Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  const { username, progress } = user;

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.contentArea}>
        <div className={styles.card}>
          <h2 className={styles.profileTitle}>Profil {username} 🌟</h2>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Progres Belajar:</h3>
            <div className={styles.progressItem}>
              <span className={styles.progressLabel}>Membaca:</span>
              <span className={styles.progressValue}>Level {progress.reading.level}</span>
              <p className={styles.progressDetail}>
                ({progress.reading.letters.length} huruf, {progress.reading.syllables.length} suku kata, {progress.reading.sentences.length} kalimat)
              </p>
            </div>
            <div className={styles.progressItem}>
              <span className={styles.progressLabel}>Menulis:</span>
              <span className={styles.progressValue}>Level {progress.writing.level}</span>
              <p className={styles.progressDetail}>
                ({progress.writing.letters.length} huruf, {progress.writing.words.length} kata, {progress.writing.sentences.length} kalimat)
              </p>
            </div>
            <div className={styles.progressItem}>
              <span className={styles.progressLabel}>Berhitung:</span>
              <span className={styles.progressValue}>Level {progress.math.level}</span>
              <p className={styles.progressDetail}>
                ({progress.math.numbers.length} angka, {progress.math.counting.length} objek, {progress.math.arithmetic.length} hitungan)
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Progres Game:</h3>
            <ul className={styles.gameList}>
              <li>
                🎮 Pattern Scanner: Highscore {progress.games.patternScanner.highscore}, Level {progress.games.patternScanner.level}
              </li>
              <li>
                🧠 Memory Trainer: Highscore {progress.games.memoryTrainer.highscore}, Level {progress.games.memoryTrainer.level}
              </li>
              <li>
                🧩 Puzzle Syarat Ganda: Highscore {progress.games.puzzleSyaratGanda.highscore}, Level {progress.games.puzzleSyaratGanda.level}
              </li>
              <li>
                🔑 Kode Rahasia: Highscore {progress.games.kodeRahasia.highscore}, Level {progress.games.kodeRahasia.level}
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Badges & Hadiah:</h3>
            <div className={styles.badgeContainer}>
              {progress.badges.map((badge, index) => (
                <span key={index} className={styles.badge}>{badge}</span>
              ))}
            </div>
          </div>

          <button onClick={handleLogout} className={`${styles.actionButton} ${styles.logoutButton}`}>
            Keluar Akun 👋
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
