import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { Link } from 'react-router-dom';
import styles from './AboutBrightSeeds.module.css';

const AboutBrightSeeds = () => {
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
        {/* Elemen animasi latar belakang untuk About page */}
        <div className={styles.sparkle} style={{ top: '15%', left: '10%', animationDelay: '0s' }}>🌟</div>
        <div className={styles.sparkle} style={{ top: '30%', left: '70%', animationDelay: '2s' }}>✨</div>
        <div className={styles.sparkle} style={{ top: '60%', left: '20%', animationDelay: '4s' }}>🎉</div>
        <div className={styles.sparkle} style={{ top: '80%', left: '85%', animationDelay: '6s' }}>🌈</div>
      </div>

      <div className={styles.container}>
        <h1 className={styles.mainTitle}>
          <span
            role="img"
            aria-label="Sparkle Icon"
            className={styles.animatedIcon}
            onMouseEnter={handleIconHover}
            onMouseLeave={handleIconLeave}
          >✨</span> Tentang BrightSeeds 🌱
        </h1>

        <p className={styles.introParagraph}>
          BrightSeeds adalah website edukasi interaktif yang dirancang khusus untuk anak-anak belajar membaca, menulis, berhitung, dan bermain sambil belajar. 🎉
        </p>

        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>
            <span
              role="img"
              aria-label="Goal Icon"
              className={styles.animatedIcon}
              onMouseEnter={handleIconHover}
              onMouseLeave={handleIconLeave}
            >🎯</span> Tujuan Kami
          </h2>
          <p className={styles.paragraph}>
            Tujuan kami adalah membantu anak-anak belajar dengan cara menyenangkan melalui game edukatif, latihan interaktif, dan aktivitas kreatif.
          </p>
        </div>

        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>
            <span
              role="img"
              aria-label="Developer Icon"
              className={styles.animatedIcon}
              onMouseEnter={handleIconHover}
              onMouseLeave={handleIconLeave}
            >🧑‍💻</span> Siapa di Balik BrightSeeds?
          </h2>
          <p className={styles.paragraph}>
            BrightSeeds dikembangkan oleh <strong>Christian Johannes Hutahaean</strong> pada tahun 2025, sebagai kontribusi nyata untuk pendidikan anak-anak Indonesia.
          </p>
        </div>

        <p className={styles.quote}>
          Kami percaya: <em>"Belajar itu menyenangkan, jika disampaikan dengan cara yang menyenangkan!"</em>
        </p>

        {/* Tombol Dashboard untuk halaman About BrightSeeds */}
        <div className={styles.dashboardButtonContainer}>
          <Link to="/dashboard" className={styles.dashboardButton}>
            Kembali ke Dashboard 🏠
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutBrightSeeds;