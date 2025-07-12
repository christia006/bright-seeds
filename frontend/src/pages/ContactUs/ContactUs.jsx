import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { Link } from 'react-router-dom';
import styles from './ContactUs.module.css';

const ContactUs = () => {
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
        {/* Elemen animasi latar belakang untuk Contact page */}
        <div className={styles.mailIcon} style={{ top: '10%', left: '10%', animationDelay: '0s' }}>✉️</div>
        <div className={styles.mailIcon} style={{ top: '30%', left: '80%', animationDelay: '2s' }}>📧</div>
        <div className={styles.mailIcon} style={{ top: '60%', left: '20%', animationDelay: '4s' }}>📬</div>
        <div className={styles.mailIcon} style={{ top: '80%', left: '70%', animationDelay: '6s' }}>💫</div>
      </div>

      <div className={styles.container}>
        <h1 className={styles.mainTitle}>
          <span
            role="img"
            aria-label="Mail Icon"
            className={styles.animatedIcon}
            onMouseEnter={handleIconHover}
            onMouseLeave={handleIconLeave}
          >✉️</span> Hubungi Kami
        </h1>

        <p className={styles.introParagraph}>
          Jika Anda memiliki pertanyaan, kritik, atau saran tentang BrightSeeds, silakan hubungi kami melalui email berikut:
        </p>

        <div className={styles.emailInfo}>
          <span
            role="img"
            aria-label="Email Emoji"
            className={styles.animatedEmailIcon}
            onMouseEnter={handleIconHover}
            onMouseLeave={handleIconLeave}
          >📧</span>{' '}
          <a href="mailto:chutahaean372@gmail.com" className={styles.emailAddress}>
            chutahaean372@gmail.com
          </a>
        </div>

        <p className={styles.closingMessage}>
          Kami senang mendengar masukan Anda untuk membuat BrightSeeds lebih baik!{' '}
          <span
            role="img"
            aria-label="Heart Icon"
            className={styles.animatedIcon}
            onMouseEnter={handleIconHover}
            onMouseLeave={handleIconLeave}
          >💖</span>
        </p>

        {/* Tombol Dashboard untuk halaman Contact Us */}
        <div className={styles.dashboardButtonContainer}>
          <Link to="/dashboard" className={styles.dashboardButton}>
            Kembali ke Dashboard 🏠
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;