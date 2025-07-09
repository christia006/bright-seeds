import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header'; // Sesuaikan path jika LandingPage punya folder sendiri
import styles from './LandingPage.module.css'; // Import CSS Module

const LandingPage = ({ currentUser }) => {
  return (
    <div className={styles.landingPageContainer}>
      <Header />
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Selamat Datang di BrightSeeds! 🌱</h1>
          <p className={styles.heroSubtitle}>
            Tempat seru untuk anak-anak belajar membaca, menulis, dan berhitung dengan cara yang menyenangkan!
          </p>
          <div className={styles.buttonGroup}>
            {currentUser ? (
              <Link to="/login" className={`${styles.ctaButton} ${styles.dashboardButton}`}>
                Lanjut Belajar! ✨
              </Link>
            ) : (
              <>
                <Link to="/register" className={styles.ctaButton}>
                  Daftar Sekarang! 🚀
                </Link>
                <Link to="/login" className={`${styles.ctaButton} ${styles.loginButton}`}>
                  Sudah Punya Akun? Masuk! 👋
                </Link>
              </>
            )}
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          {/* Ganti dengan gambar ilustrasi yang menarik untuk anak-anak */}
          <img
            src="/images/Anak.png" // Pastikan gambar ini ada di public/images
            alt="Anak-anak belajar dengan gembira"
            className={styles.heroImage}
          />
        </div>
      </div>

      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Mengapa BrightSeeds? 🤔</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <span role="img" aria-label="reading" className={styles.featureIcon}>📖</span>
            <h3>Belajar Membaca</h3>
            <p>Dari mengenal huruf hingga mengeja suku kata dan kalimat.</p>
          </div>
          <div className={styles.featureCard}>
            <span role="img" aria-label="writing" className={styles.featureIcon}>✍️</span>
            <h3>Menulis Kreatif</h3>
            <p>Berlatih menulis dengan aktivitas yang seru dan interaktif.</p>
          </div>
          <div className={styles.featureCard}>
            <span role="img" aria-label="math" className={styles.featureIcon}>➕</span>
            <h3>Matematika Menyenangkan</h3>
            <p>Konsep angka, penjumlahan, dan pengurangan jadi lebih mudah dipahami.</p>
          </div>
          <div className={styles.featureCard}>
            <span role="img" aria-label="games" className={styles.featureIcon}>🎮</span>
            <h3>Game Edukatif</h3>
            <p>Belajar sambil bermain game yang dirancang khusus untuk anak-anak.</p>
          </div>
        </div>
      </section>

      <section className={styles.callToActionSection}>
        <h2 className={styles.sectionTitle}>Siap untuk Petualangan Belajar? ✨</h2>
        {currentUser ? (
             <Link to="/login" className={`${styles.ctaButton} ${styles.dashboardButton}`}>
                Mulai Petualanganmu! 🚀
            </Link>
        ) : (
            <Link to="/register" className={styles.ctaButton}>
            Daftar Gratis Sekarang! 🎉
            </Link>
        )}
      </section>
    </div>
  );
};

// --- INI ADALAH BAGIAN PENTINGNYA ---
// Pastikan baris ini ada di akhir file LandingPage.jsx
export default LandingPage;