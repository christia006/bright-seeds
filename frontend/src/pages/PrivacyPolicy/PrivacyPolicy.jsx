import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { Link } from 'react-router-dom'; // Import Link untuk tombol Dashboard
import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleIconHover = (event) => {
    event.target.classList.add(styles.iconBounce);
  };

  const handleIconLeave = (event) => {
    event.target.classList.remove(styles.iconBounce);
  };

  return (
    <div className={styles.pageWrapper}>
    

      <div className={styles.animatedBackground}>
        <div className={styles.seed} style={{ top: '10%', left: '5%', animationDelay: '0s' }}>🌱</div>
        <div className={styles.seed} style={{ top: '25%', left: '80%', animationDelay: '1.5s' }}>🌟</div>
        <div className={styles.seed} style={{ top: '50%', left: '15%', animationDelay: '3s' }}>✨</div>
        <div className={styles.seed} style={{ top: '70%', left: '60%', animationDelay: '4.5s' }}>💧</div>
        <div className={styles.seed} style={{ top: '85%', left: '30%', animationDelay: '6s' }}>🌈</div>
      </div>

      <div className={styles.container}>
        <h1 className={styles.mainTitle}>
          <span
            role="img"
            aria-label="Privacy Shield"
            className={styles.animatedIcon}
            onMouseEnter={handleIconHover}
            onMouseLeave={handleIconLeave}
          >🔒</span> Kebijakan Privasi BrightSeeds
        </h1>
        <p className={styles.introParagraph}>Selamat datang di BrightSeeds! 🌱</p>
        <p className={styles.paragraph}>
          Kami menghargai privasi Anda. Halaman ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi dari pengguna.
        </p>

        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>
            <span
              role="img"
              aria-label="Information Icon"
              className={styles.animatedIcon}
              onMouseEnter={handleIconHover}
              onMouseLeave={handleIconLeave}
            >ℹ️</span> Informasi yang Kami Kumpulkan
          </h2>
          <ul className={styles.infoList}>
            <li>BrightSeeds sendiri <strong>tidak mengumpulkan data pribadi langsung</strong>.</li>
            <li>Kami menggunakan Google AdSense untuk menayangkan iklan. Google dapat menggunakan cookie untuk menampilkan iklan yang relevan bagi Anda.</li>
          </ul>
        </div>

        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>
            <span
              role="img"
              aria-label="Cookie Icon"
              className={styles.animatedIcon}
              onMouseEnter={handleIconHover}
              onMouseLeave={handleIconLeave}
            >🍪</span> Penggunaan Cookie
          </h2>
          <p className={styles.paragraph}>
            Cookie membantu menyesuaikan konten dan iklan agar lebih sesuai untuk setiap pengguna.
          </p>
        </div>

        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>
            <span
              role="img"
              aria-label="Third Party Icon"
              className={styles.animatedIcon}
              onMouseEnter={handleIconHover}
              onMouseLeave={handleIconLeave}
            >🤝</span> Pihak Ketiga
          </h2>
          <p className={styles.paragraph}>
            BrightSeeds menayangkan iklan melalui Google AdSense. Kami tidak memiliki kendali atas cookie yang digunakan pihak ketiga tersebut.
          </p>
        </div>

        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>
            <span
              role="img"
              aria-label="Consent Icon"
              className={styles.animatedIcon}
              onMouseEnter={handleIconHover}
              onMouseLeave={handleIconLeave}
            >✅</span> Persetujuan
          </h2>
          <p className={styles.paragraph}>
            Dengan menggunakan situs BrightSeeds, Anda menyetujui kebijakan privasi ini.
          </p>
        </div>

        <p className={styles.lastUpdated}>Terakhir diperbarui: 13 Juli 2025</p>

        {/* --- Tombol Dashboard baru di dalam konten halaman Privacy Policy --- */}
        <div className={styles.dashboardButtonContainer}>
          <Link to="/dashboard" className={styles.dashboardButton}>
            Kembali ke Dashboard 🏠
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;