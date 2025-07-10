import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header'; // Pastikan path sesuai struktur proyek
import styles from './ProfilePage.module.css'; // Import CSS Module

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Dummy user data langsung di sini
    const dummyUser = {
      username: "Guest",
      progress: {
        reading: { level: 1, letters: ['a', 'b'], syllables: ['ba'], sentences: ['Ini kalimat'] },
        writing: { level: 1, letters: ['c'], words: ['cat'], sentences: ['Saya menulis'] },
        math: { level: 1, numbers: [1,2], counting: [3], arithmetic: [4+1] },
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
              <span className={styles.progressValue}>Level {progress?.reading?.level || 1}</span>
              <p className={styles.progressDetail}>
                ({progress.reading.letters?.length || 0} huruf, {progress.reading.syllables?.length || 0} suku kata, {progress.reading.sentences?.length || 0} kalimat)
              </p>
            </div>
            <div className={styles.progressItem}>
              <span className={styles.progressLabel}>Menulis:</span>
              <span className={styles.progressValue}>Level {progress?.writing?.level || 1}</span>
              <p className={styles.progressDetail}>
                ({progress.writing.letters?.length || 0} huruf, {progress.writing.words?.length || 0} kata, {progress.writing.sentences?.length || 0} kalimat)
              </p>
            </div>
            <div className={styles.progressItem}>
              <span className={styles.progressLabel}>Berhitung:</span>
              <span className={styles.progressValue}>Level {progress?.math?.level || 1}</span>
              <p className={styles.progressDetail}>
                ({progress.math.numbers?.length || 0} angka, {progress.math.counting?.length || 0} objek, {progress.math.arithmetic?.length || 0} hitungan)
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Progres Game:</h3>
            <ul className={styles.gameList}>
              <li>
                <span className={styles.gameName}>🎮 Pattern Scanner:</span>
                <span className={styles.gameScore}>Highscore: {progress.games.patternScanner?.highscore || 0}</span>
                <span className={styles.gameLevel}>Level: {progress.games.patternScanner?.level || 'Mudah'}</span>
              </li>
              <li>
                <span className={styles.gameName}>🧠 Memory Trainer:</span>
                <span className={styles.gameScore}>Highscore: {progress.games.memoryTrainer?.highscore || 0}</span>
                <span className={styles.gameLevel}>Level: {progress.games.memoryTrainer?.level || 'Mudah'}</span>
              </li>
              <li>
                <span className={styles.gameName}>🧩 Puzzle Syarat Ganda:</span>
                <span className={styles.gameScore}>Highscore: {progress.games.puzzleSyaratGanda?.highscore || 0}</span>
                <span className={styles.gameLevel}>Level: {progress.games.puzzleSyaratGanda?.level || 'Mudah'}</span>
              </li>
              <li>
                <span className={styles.gameName}>🔑 Kode Rahasia:</span>
                <span className={styles.gameScore}>Highscore: {progress.games.kodeRahasia?.highscore || 0}</span>
                <span className={styles.gameLevel}>Level: {progress.games.kodeRahasia?.level || 'Mudah'}</span>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Badges & Hadiah:</h3>
            {progress.badges?.length > 0 ? (
              <div className={styles.badgeContainer}>
                {progress.badges.map((badge, index) => (
                  <span key={index} className={styles.badge}>{badge}</span>
                ))}
              </div>
            ) : (
              <p className={styles.infoMessage}>Belum ada badge. Ayo belajar dan bermain untuk mendapatkannya! 🏆</p>
            )}
          </div>

          <button onClick={() => alert('Keluar Akun (dummy)')} className={`${styles.actionButton} ${styles.logoutButton}`}>
            Keluar Akun <span role="img" aria-label="logout">👋</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
