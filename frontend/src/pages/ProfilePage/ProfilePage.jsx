import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header'; // Sesuaikan path
import { fetchUserProfile } from '../../services/userService';
import LoadingSpinner from '../../components/LoadingSpinner';
import styles from './ProfilePage.module.css'; // Import CSS Module

const ProfilePage = ({ currentUser, onLogout, setCurrentUser }) => {
  const [localUser, setLocalUser] = useState(currentUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserProfile = async () => {
      if (currentUser && currentUser.username) {
        try {
          setLoading(true);
          const updatedUser = await fetchUserProfile(currentUser.username);
          setLocalUser(updatedUser);
          setCurrentUser(updatedUser); // Keep App.jsx state in sync
        } catch (err) {
          setError('Gagal memuat data profil.');
          console.error('Error fetching profile:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('Tidak ada pengguna yang login.');
      }
    };
    getUserProfile();
  }, [currentUser?.username, setCurrentUser]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.contentArea}>
          <div className={styles.card}>
            <p className={styles.errorMessage}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!localUser) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.contentArea}>
          <div className={styles.card}>
            <p className={styles.infoMessage}>Data pengguna tidak tersedia. Silakan login kembali.</p>
          </div>
        </div>
      </div>
    );
  }

  const { username, progress } = localUser;

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

          <button onClick={onLogout} className={`${styles.actionButton} ${styles.logoutButton}`}>
            Keluar Akun <span role="img" aria-label="logout">👋</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- INI ADALAH BAGIAN PENTINGNYA ---
export default ProfilePage;