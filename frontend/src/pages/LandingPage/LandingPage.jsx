// brightseeds-app/frontend/src/pages/LandingPage/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from '../../components/Header/Header';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  const navigate = useNavigate(); // Inisialisasi hook useNavigate untuk navigasi
  const [showModal, setShowModal] = useState(false); // State untuk mengontrol visibilitas modal
  const [currentStep, setCurrentStep] = useState(1); // State untuk melacak langkah modal (1: Nama, 2: Jenis Kelamin, 3: Selamat Datang, 4: Memuat)
  const [userName, setUserName] = useState(''); // State untuk menyimpan nama pengguna
  const [userGender, setUserGender] = useState(''); // State untuk menyimpan jenis kelamin pengguna
  const [welcomeMessage, setWelcomeMessage] = useState(''); // State untuk menyimpan pesan selamat datang
  const [displayedWelcomeMessage, setDisplayedWelcomeMessage] = useState(''); // State untuk pesan selamat datang yang ditampilkan dengan efek mengetik

  // Ref untuk Suara Klik Tombol/Kartu
  const clickAudioRef = useRef(null);

  // Efek samping untuk inisialisasi suara klik
  useEffect(() => {
    // Inisialisasi objek Audio untuk suara klik hanya sekali
    if (!clickAudioRef.current) {
      clickAudioRef.current = new Audio('/sound/tombol.mp3'); // Pastikan path ini benar
      clickAudioRef.current.volume = 0.8; // Atur volume untuk suara klik
    }
  }, []); // Berjalan hanya sekali saat komponen dipasang

  // Fungsi untuk memutar suara klik
  const playClickSound = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0; // Setel ulang ke awal jika sudah diputar
      clickAudioRef.current.play().catch(e => console.error("Gagal memutar suara klik:", e));
    }
  };

  // Efek untuk animasi mengetik pada pesan selamat datang
  useEffect(() => {
    if (currentStep === 3 && welcomeMessage) {
      let i = 0;
      setDisplayedWelcomeMessage(''); // Reset pesan yang ditampilkan sebelum memulai mengetik
      const typingInterval = setInterval(() => {
        if (i < welcomeMessage.length) {
          setDisplayedWelcomeMessage((prev) => prev + welcomeMessage.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 70); // Kecepatan mengetik (ms per karakter)
      return () => clearInterval(typingInterval); // Bersihkan interval saat komponen unmount atau step berubah
    } else {
      setDisplayedWelcomeMessage(''); // Bersihkan pesan jika bukan di langkah selamat datang
    }
  }, [currentStep, welcomeMessage]); // Bergantung pada currentStep dan welcomeMessage

  // Fungsi yang dipanggil saat tombol "Lanjut Belajar!" atau "Mulai Petualanganmu!" diklik
  const handleStartLearning = () => {
    playClickSound(); // Play sound on button click
    setShowModal(true); // Tampilkan modal
    setCurrentStep(1); // Atur langkah awal ke input nama
    setUserName(''); // Reset nama pengguna
    setUserGender(''); // Reset jenis kelamin pengguna
    setWelcomeMessage(''); // Reset pesan selamat datang
    setDisplayedWelcomeMessage(''); // Reset pesan yang ditampilkan
  };

  // Fungsi untuk menangani pengiriman nama
  const handleNameSubmit = () => {
    playClickSound(); // Play sound on button click
    if (userName.trim() === '') {
      console.error('Nama tidak boleh kosong!'); // Nama tidak boleh kosong!
      return;
    }
    setCurrentStep(2); // Lanjutkan ke langkah pemilihan jenis kelamin
  };

  // Fungsi untuk menangani pengiriman jenis kelamin
  const handleGenderSubmit = (gender) => {
    playClickSound(); // Play sound on button click
    setUserGender(gender); // Simpan jenis kelamin yang dipilih
    // Tentukan sapaan berdasarkan jenis kelamin
    const greeting = gender === 'laki-laki' ? 'ganteng' : 'Cantik'; // tampan : cantik
    setWelcomeMessage(`Selamat datang ${userName} ${greeting}`); // Buat pesan selamat datang
    setCurrentStep(3); // Tampilkan pesan selamat datang

    // Setelah menampilkan pesan selamat datang, transisi ke loading
    // Durasi timeout ini harus mempertimbangkan durasi animasi mengetik
    setTimeout(() => {
      setCurrentStep(4); // Tampilkan animasi loading
      // Setelah loading selesai, navigasi ke dashboard
      setTimeout(() => {
        setShowModal(false); // Sembunyikan modal
        navigate('/dashboard'); // Navigasi ke halaman dashboard
      }, 2000); // Durasi loading: 2 detik
    }, welcomeMessage.length * 100 + 3000); // Durasi total: (panjang pesan * kecepatan mengetik) + durasi tampilan pesan (1.5 detik)
  };

  // Fungsi untuk merender konten modal berdasarkan langkah saat ini
  const renderModalContent = () => {
    switch (currentStep) {
      case 1: // Langkah 1: Input Nama
        return (
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>Siapa namamu?</h3> {/* What is your name? */}
            <input
              type="text"
              className={styles.modalInput}
              placeholder="Masukkan namamu..." // Enter your name...
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button className={styles.modalButton} onClick={handleNameSubmit}>
              Lanjut {/* Continue */}
            </button>
          </div>
        );
      case 2: // Langkah 2: Pemilihan Jenis Kelamin
        return (
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>Jenis kelaminmu?</h3> {/* Your gender? */}
            <div className={styles.genderOptions}>
              <button
                className={`${styles.genderButton} ${userGender === 'laki-laki' ? styles.selected : ''}`}
                onClick={() => handleGenderSubmit('laki-laki')}
              >
                Laki-laki 👦 {/* Male */}
              </button>
              <button
                className={`${styles.genderButton} ${userGender === 'perempuan' ? styles.selected : ''}`}
                onClick={() => handleGenderSubmit('perempuan')}
              >
                Perempuan 👧 {/* Female */}
              </button>
            </div>
          </div>
        );
      case 3: // Langkah 3: Pesan Selamat Datang
        return (
          <div className={`${styles.modalCard} ${styles.welcomeCard}`}>
            <h3 className={styles.welcomeMessage}>
              {displayedWelcomeMessage}
              <span className={styles.typingCursor}>|</span> {/* Kursor mengetik */}
            </h3>
            <div className={styles.welcomeEmoji}>🎉</div>
          </div>
        );
      case 4: // Langkah 4: Animasi Loading
        return (
          <div className={`${styles.modalCard} ${styles.loadingCard}`}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>Mempersiapkan petualanganmu...</p> {/* Preparing your adventure... */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.landingPageContainer}>
      <Header />
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Selamat Datang di BrightSeeds! 🌱</h1> {/* Welcome to BrightSeeds! */}
          <p className={styles.heroSubtitle}>
            Tempat seru untuk anak-anak belajar membaca, menulis, dan berhitung dengan cara yang menyenangkan!
            {/* A fun place for children to learn reading, writing, and counting in an enjoyable way! */}
          </p>
          <div className={styles.buttonGroup}>
            {/* Mengubah Link menjadi tombol yang memicu modal */}
            <button onClick={handleStartLearning} className={`${styles.ctaButton} ${styles.dashboardButton}`}>
              Lanjut Belajar! ✨ {/* Continue Learning! */}
            </button>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <img
            src="/images/Anak.png"
            alt="Anak-anak belajar dengan gembira" // Children learning happily
            className={styles.heroImage}
          />
        </div>
      </div>

      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Mengapa BrightSeeds? 🤔</h2> {/* Why BrightSeeds? */}
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard} onClick={playClickSound}>
            <span role="img" aria-label="reading" className={styles.featureIcon}>📖</span>
            <h3>Belajar Membaca</h3> {/* Learn to Read */}
            <p>Dari mengenal huruf hingga mengeja suku kata dan kalimat.</p> {/* From recognizing letters to spelling syllables and sentences. */}
          </div>
          <div className={styles.featureCard} onClick={playClickSound}>
            <span role="img" aria-label="writing" className={styles.featureIcon}>✍️</span>
            <h3>Menulis Kreatif</h3> {/* Creative Writing */}
            <p>Berlatih menulis dengan aktivitas yang seru dan interaktif.</p> {/* Practice writing with fun and interactive activities. */}
          </div>
          <div className={styles.featureCard} onClick={playClickSound}>
            <span role="img" aria-label="math" className={styles.featureIcon}>➕</span>
            <h3>Matematika Menyenangkan</h3> {/* Fun Math */}
            <p>Konsep angka, penjumlahan, dan pengurangan jadi lebih mudah dipahami.</p> {/* Number concepts, addition, and subtraction become easier to understand. */}
          </div>
          <div className={styles.featureCard} onClick={playClickSound}>
            <span role="img" aria-label="games" className={styles.featureIcon}>🎮</span>
            <h3>Game Edukatif</h3> {/* Educational Games */}
            <p>Belajar sambil bermain game yang dirancang khusus untuk anak-anak.</p> {/* Learn while playing games specially designed for children. */}
          </div>

          <div className={styles.featureCard} onClick={playClickSound}>
            <span role="img" aria-label="games" className={styles.featureIcon}>🗺️</span>
            <h3>Path Finder</h3>
            <p>Temukan jalan terpendek di labirin yang rumit!</p> {/* Find the shortest path in a complex maze! */}
          </div>


          <div className={styles.featureCard} onClick={playClickSound}>
            <span role="img" aria-label="games" className={styles.featureIcon}>️🏰 </span>
            <h3>Wumpus World Deluxe</h3>
            <p>Lab AI klasik yang melatih penalaran & perencanaan!</p> {/* Classic AI lab that trains reasoning & planning! */}
          </div>

        </div>
      </section>

      <section className={styles.callToActionSection}>
        <h2 className={styles.sectionTitle}>Siap untuk Petualangan Belajar? ✨</h2> {/* Ready for a Learning Adventure? */}
        {/* Mengubah Link menjadi tombol yang memicu modal */}
        <button onClick={handleStartLearning} className={`${styles.ctaButton} ${styles.dashboardButton}`}>
          Mulai Petualanganmu! 🚀 {/* Start Your Adventure! */}
        </button>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2025 Christian J Hutahaean. All rights reserved.</p>
      </footer>

      {/* Overlay dan Konten Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          {renderModalContent()}
        </div>
      )}
    </div>
  );
};

export default LandingPage;
