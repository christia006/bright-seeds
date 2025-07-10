import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Header from '../../components/Header/Header';
import { getSoundPath } from '../../utils/soundHelper'; // Pastikan path ini benar
import styles from './WritingPage.module.css';
import ConfettiExplosion from 'react-confetti-explosion'; // Untuk efek konfeti

// Data untuk konten menulis (huruf, kata, kalimat)
const writingContent = {
  letters: {
    title: "Menulis Huruf",
    instructions: "Dengarkan suara huruf, lalu ketikkan huruf tersebut di kolom jawaban. Gunakan huruf kecil.",
    examples: [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
      'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg', 'hh', 'ii', 'jj', 'kk', 'll', 'mm', 'nn', 'oo',
      'pp', 'qq', 'rr', 'ss', 'tt', 'uu', 'vv', 'ww', 'xx', 'yy', 'zz',
      'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah', 'ai', 'aj', 'ak',
      'ba', 'ca', 'da', 'ea', 'fa', 'ga', 'ha', 'ia', 'ja', 'ka'
    ],
    soundType: 'letter',
  },
  words: {
    title: "Menulis Kata",
    instructions: "Dengarkan kata yang diucapkan, lalu ketikkan kata tersebut di kolom jawaban. Gunakan huruf kecil.",
    examples: [
      'apel', 'buku', 'bola', 'susu', 'roti', 'kucing', 'rumah', 'mobil', 'ikan', 'burung',
      'meja', 'kursi', 'pensil', 'papan', 'bunga', 'lampu', 'pintu', 'jendela', 'sendok', 'garpu',
      'naga', 'harimau', 'gajah', 'kelinci', 'monyet', 'kura', 'singa', 'jerapah', 'kuda', 'domba',
      'jalan', 'makan', 'minum', 'tidur', 'duduk', 'berdiri', 'lompat', 'lari', 'terbang', 'berenang',
      'cantik', 'pandai', 'rajin', 'malas', 'sedih', 'senang', 'marah', 'takut', 'lapar', 'haus'
    ],
    soundType: 'word',
  },
  sentences: {
    title: "Menulis Kalimat",
    instructions: "Dengarkan kalimat yang diucapkan, lalu ketikkan kalimat tersebut di kolom jawaban. Perhatikan spasi dan tanda baca.",
    examples: [
      'ini adalah apel merah.',
      'buku itu ada di meja.',
      'anak itu bermain bola.',
      'aku suka minum susu.',
      'ibu membuatkan roti.',
      'kucing itu tidur di sofa.',
      'rumahku sangat besar.',
      'mobil berwarna biru.',
      'ikan berenang di air.',
      'burung terbang tinggi.',
      'dia sedang membaca buku.',
      'kami pergi ke sekolah.',
      'ayah minum kopi panas.',
      'kakak memasak nasi goreng.',
      'adik menggambar pemandangan.',
      'bunga mawar sangat indah.',
      'langit terlihat biru cerah.',
      'pohon besar banyak daunnya.',
      'malam hari ada bintang.',
      'bulan bersinar terang.',
      'anak-anak suka bermain di taman.',
      'ayah bekerja setiap hari.',
      'ibu memasak makanan enak.',
      'guru mengajar di kelas.',
      'kami belajar di sekolah.',
      'dia suka makan nasi.',
      'saya minum air putih.',
      'mereka pergi ke pasar.',
      'dia adalah teman baikku.',
      'kami sangat bahagia.'
    ],
    soundType: 'sentence',
  },
};

const WritingPage = () => {
  const [selectedSection, setSelectedSection] = useState('letters'); // Bagian yang sedang dipilih (huruf, kata, kalimat)
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0); // Indeks contoh soal saat ini
  const [userInput, setUserInput] = useState(''); // Input dari pengguna
  const [feedback, setFeedback] = useState(''); // Pesan umpan balik
  const [feedbackColor, setFeedbackColor] = useState(''); // Warna pesan umpan balik
  const [isExploding, setIsExploding] = useState(false); // State untuk mengaktifkan konfeti

  const audioRef = useRef(new Audio()); // Referensi untuk elemen audio
  const navigate = useNavigate(); // Hook untuk navigasi antar halaman

  const currentContent = writingContent[selectedSection]; // Konten berdasarkan bagian yang dipilih
  const currentExample = currentContent.examples[currentExampleIndex]; // Contoh soal saat ini

  // Efek samping saat bagian (letters, words, sentences) berubah
  useEffect(() => {
    setUserInput(''); // Bersihkan input
    setFeedback(''); // Bersihkan umpan balik
    setFeedbackColor(''); // Bersihkan warna umpan balik
    setCurrentExampleIndex(0); // Reset indeks contoh ke awal
    setIsExploding(false); // Pastikan konfeti mati
  }, [selectedSection]);

  // Fungsi untuk memutar suara dari file atau fallback ke Web Speech API
  const playSound = () => {
    if (!currentExample) return; // Jika tidak ada contoh, jangan lakukan apa-apa

    const soundText = currentExample.toLowerCase();
    const soundPath = getSoundPath(soundText, currentContent.soundType); // Dapatkan path suara

    if (soundPath) {
      audioRef.current.src = soundPath;
      audioRef.current.play().catch(e => {
        console.warn("Error playing sound from file, falling back to Web Speech API:", e);
        playWebSpeech(currentExample); // Fallback jika file suara gagal diputar
      });
    } else {
      console.warn("No specific sound file found, falling back to Web Speech API for:", currentExample);
      playWebSpeech(currentExample); // Fallback jika tidak ada file suara
    }
  };

  // Fungsi untuk memutar teks menggunakan Web Speech API (Text-to-Speech)
  const playWebSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'id-ID'; // Atur bahasa ke Bahasa Indonesia
      msg.rate = 0.7; // Atur kecepatan bicara agar lebih ramah anak
      msg.pitch = 1.0; // Atur pitch standar

      // Coba temukan suara Bahasa Indonesia
      const voices = window.speechSynthesis.getVoices();
      const indoVoice = voices.find(voice => voice.lang === 'id-ID' && voice.name.includes('Google Bahasa Indonesia'));
      if (indoVoice) {
          msg.voice = indoVoice;
      }

      window.speechSynthesis.speak(msg);
    } else {
      console.error("Browser Anda tidak mendukung Web Speech API."); // Log error
      setFeedback("Maaf, browser Anda tidak mendukung fitur suara."); // Beri umpan balik ke pengguna
      setFeedbackColor("orange");
    }
  };

  // Handler saat pengguna menekan tombol "Periksa"
  const handleSubmit = async () => {
    const trimmedInput = userInput.trim().toLowerCase(); // Bersihkan dan ubah ke huruf kecil
    const trimmedExample = currentExample.trim().toLowerCase(); // Bersihkan dan ubah ke huruf kecil

    if (trimmedInput === trimmedExample) {
      // Umpan balik positif untuk anak-anak
      setFeedback('Hebat! Betul sekali! Lanjut ke tantangan berikutnya! ✨');
      setFeedbackColor('green');
      setIsExploding(true); // Aktifkan konfeti

      // Lanjutkan ke soal berikutnya setelah jeda singkat untuk umpan balik/konfeti
      setTimeout(() => {
        setIsExploding(false); // Matikan konfeti
        if (currentExampleIndex < currentContent.examples.length - 1) {
          setCurrentExampleIndex(currentExampleIndex + 1); // Lanjut ke contoh berikutnya
        } else {
          // Jika semua contoh selesai, kembali ke contoh pertama
          setCurrentExampleIndex(0);
          setFeedback('Kamu sudah menyelesaikan semua tantangan di bagian ini! Hebat! 🎉');
          setFeedbackColor('purple');
        }
        setUserInput(''); // Bersihkan input untuk soal berikutnya
        setTimeout(() => {
          setFeedback(''); // Bersihkan pesan umpan balik
          setFeedbackColor('');
        }, 1000); // Bersihkan umpan balik setelah ditampilkan sebentar
      }, 1500); // Tunggu konfeti selesai sebelum pindah soal

    } else {
      // Umpan balik negatif untuk anak-anak
      setFeedback('Coba lagi, ya! Jangan menyerah! Kamu pasti bisa! 💪');
      setFeedbackColor('red');
      setIsExploding(false); // Pastikan konfeti mati untuk jawaban salah
      // TIDAK lanjut ke soal berikutnya jika jawaban salah
    }
  };

  // Handler untuk melewati soal saat ini
  const handleSkip = () => {
    setIsExploding(false); // Pastikan konfeti mati saat melewati
    if (currentExampleIndex < currentContent.examples.length - 1) {
      setCurrentExampleIndex(currentExampleIndex + 1); // Lanjut ke contoh berikutnya
    } else {
      setCurrentExampleIndex(0); // Kembali ke contoh pertama jika semua selesai
    }
    setUserInput(''); // Bersihkan input
    setFeedback(''); // Bersihkan umpan balik
    setFeedbackColor(''); // Bersihkan warna umpan balik
  };

  // Handler untuk navigasi ke Dashboard
  const handleGoToDashboard = () => {
    navigate('/dashboard'); // Navigasi ke halaman Dashboard
  };

  return (
    <div className={styles.writingPageContainer}>
      <Header />
      <div className={styles.contentArea}>
        {/* Konfeti akan muncul di sini */}
        {isExploding && (
            <div className={styles.confettiContainer}>
                <ConfettiExplosion
                    force={0.8}
                    duration={3000} // Durasi konfeti dalam milidetik
                    particleCount={100} // Jumlah partikel
                    width={1000} // Lebar area konfeti
                    height={1000} // Tinggi area konfeti
                    colors={['#FFC107', '#4CAF50', '#8E24AA', '#FF5722']} // Warna-warna cerah ramah anak
                />
            </div>
        )}

        <h1 className={styles.pageTitle}>Ayo Menulis! ✍️</h1>

        {/* Bagian pemilih kategori (Huruf, Kata, Kalimat) */}
        <div className={styles.sectionSelector}>
          <button
            onClick={() => setSelectedSection('letters')}
            className={`${styles.sectionButton} ${selectedSection === 'letters' ? styles.active : ''}`}
          >
            Menulis Huruf
          </button>
          <button
            onClick={() => setSelectedSection('words')}
            className={`${styles.sectionButton} ${selectedSection === 'words' ? styles.active : ''}`}
          >
            Menulis Kata
          </button>
          <button
            onClick={() => setSelectedSection('sentences')}
            className={`${styles.sectionButton} ${selectedSection === 'sentences' ? styles.active : ''}`}
          >
            Menulis Kalimat
          </button>
        </div>

        {/* Kartu utama untuk aktivitas menulis */}
        <div className={styles.writingCard}>
          <h2 className={styles.cardTitle}>{currentContent.title}</h2>
          <p className={styles.instructions}>{currentContent.instructions}</p>

          <div className={styles.exampleContainer}>
            {/* Teks contoh yang harus ditulis (bisa disembunyikan di produksi) */}
            {/* <p className={styles.hiddenExampleText}>
                Kata yang harus kamu tulis: "{currentExample}"
            </p> */}
            <button onClick={playSound} className={styles.speakButton}>
              <span role="img" aria-label="speaker">🔊</span> Dengar Suara
            </button>
          </div>

          {/* Area input teks */}
          <textarea
            className={styles.writingInput}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Tulis di sini..."
            rows="3"
          />

          {/* Pesan umpan balik */}
          <div className={styles.feedbackMessage} style={{ color: feedbackColor }}>
            {feedback}
          </div>

          {/* Grup tombol aksi */}
          <div className={styles.buttonGroup}>
            <button onClick={handleSubmit} className={styles.submitButton}>
              Periksa ✅
            </button>
            <button onClick={handleSkip} className={styles.skipButton}>
              Lewati ⏭️
            </button>
          </div>
        </div>

        {/* Tombol Dashboard */}
        <button
          onClick={handleGoToDashboard}
          className={styles.dashboardButtonWriting}
        >
          <span role="img" aria-label="dashboard">🏠</span> Dashboard Utama
        </button>
      </div>
    </div>
  );
};

export default WritingPage;
