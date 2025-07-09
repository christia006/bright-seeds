import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header/Header';
import { updateUserProgess } from '../../services/userService';
import { getSoundPath } from '../../utils/soundHelper';
import styles from './WritingPage.module.css';
import ConfettiExplosion from 'react-confetti-explosion'; // Import the confetti component

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
    levelThreshold: 5
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
    levelThreshold: 5
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
    levelThreshold: 3
  },
};

const MAX_LEVEL = 20;

const WritingPage = ({ currentUser, setCurrentUser }) => {
  const [selectedSection, setSelectedSection] = useState('letters');
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('');
  const [level, setLevel] = useState(currentUser?.progress?.writing?.level || 1);
  const [isExploding, setIsExploding] = useState(false); // New state for confetti

  const audioRef = useRef(new Audio());

  const currentContent = writingContent[selectedSection];
  const currentExample = currentContent.examples[currentExampleIndex];

  useEffect(() => {
    setUserInput('');
    setFeedback('');
    setFeedbackColor('');
    setCurrentExampleIndex(0);
    setIsExploding(false); // Reset confetti when section changes
  }, [selectedSection]);

  const playSound = () => {
    if (!currentExample) return;

    const soundText = currentExample.toLowerCase();
    const soundPath = getSoundPath(soundText, currentContent.soundType);

    if (soundPath) {
      audioRef.current.src = soundPath;
      audioRef.current.play().catch(e => {
        console.warn("Error playing sound from file, falling back to Web Speech API:", e);
        playWebSpeech(currentExample);
      });
    } else {
      console.warn("No specific sound file found, falling back to Web Speech API for:", currentExample);
      playWebSpeech(currentExample);
    }
  };

  const playWebSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'id-ID';
      msg.rate = 0.7;
      msg.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const indoVoice = voices.find(voice => voice.lang === 'id-ID' && voice.name.includes('Google Bahasa Indonesia'));
      if (indoVoice) {
          msg.voice = indoVoice;
      }

      window.speechSynthesis.speak(msg);
    } else {
      alert("Browser Anda tidak mendukung Web Speech API.");
    }
  };

  const handleSubmit = async () => {
    const trimmedInput = userInput.trim().toLowerCase();
    const trimmedExample = currentExample.trim().toLowerCase();

    if (trimmedInput === trimmedExample) {
      setFeedback('Hebat! Jawabanmu benar! 🎉');
      setFeedbackColor('green');
      setIsExploding(true); // Trigger confetti on correct answer

      try {
        const currentSectionProgress = currentUser.progress?.writing?.[selectedSection] || [];
        const newCompleted = [...currentSectionProgress, currentExample];
        const uniqueCompleted = Array.from(new Set(newCompleted));

        let newLevel = level;
        const totalExamples = currentContent.examples.length;
        const completedCount = uniqueCompleted.length;
        const threshold = currentContent.levelThreshold;

        const calculatedLevel = Math.min(MAX_LEVEL, Math.floor(completedCount / threshold) + 1);

        if (calculatedLevel > level) {
            newLevel = calculatedLevel;
            setFeedback('Selamat! Kamu naik ke Level ' + newLevel + '! 🚀');
            setFeedbackColor('purple');
        } else if (completedCount === totalExamples && level < MAX_LEVEL) {
            newLevel = Math.min(MAX_LEVEL, level + 1);
            setFeedback('Selamat! Kamu telah menyelesaikan semua contoh di bagian ini dan naik ke Level ' + newLevel + '! 🏆');
            setFeedbackColor('blue');
        } else if (completedCount === totalExamples && level === MAX_LEVEL) {
             setFeedback('Luar biasa! Kamu telah menyelesaikan semua di Level Maksimal! ✨');
             setFeedbackColor('gold');
        }

        const updatedUser = await updateUserProgess(currentUser.username, {
          writing: {
            ...currentUser.progress?.writing,
            [selectedSection]: uniqueCompleted,
            level: newLevel,
          }
        });
        setCurrentUser(updatedUser);
        setLevel(newLevel);

        setTimeout(() => {
          setIsExploding(false); // Hide confetti after a short delay
          if (currentExampleIndex < currentContent.examples.length - 1) {
            setCurrentExampleIndex(currentExampleIndex + 1);
          } else {
            setCurrentExampleIndex(0);
          }
          setUserInput('');
          setTimeout(() => {
            setFeedback('');
            setFeedbackColor('');
          }, 1000);
        }, 1500);
      } catch (error) {
        setFeedback('Gagal menyimpan progres: ' + error.message);
        setFeedbackColor('red');
        setTimeout(() => { setFeedback(''); setFeedbackColor(''); }, 3000);
      }

    } else {
      setFeedback('Coba lagi! Jawabanmu belum tepat. 🤔');
      setFeedbackColor('red');
      setIsExploding(false); // Ensure confetti is off for incorrect answers
    }
  };

  const handleSkip = () => {
    setIsExploding(false); // Ensure confetti is off when skipping
    if (currentExampleIndex < currentContent.examples.length - 1) {
      setCurrentExampleIndex(currentExampleIndex + 1);
    } else {
      setCurrentExampleIndex(0);
    }
    setUserInput('');
    setFeedback('');
    setFeedbackColor('');
  };

  return (
    <div className={styles.writingPageContainer}>
      <Header />
      <div className={styles.contentArea}>
        {isExploding && (
            <div className={styles.confettiContainer}>
                {/* Adjust the force, duration, and other props for desired effect */}
                <ConfettiExplosion
                    force={0.8}
                    duration={3000} // milliseconds
                    particleCount={100}
                    width={1000}
                    height={1000} // Adjust height to cover more screen area
                    colors={['#FFC107', '#4CAF50', '#8E24AA', '#FF5722']} // Kid-friendly colors
                />
            </div>
        )}

        <h1 className={styles.pageTitle}>Ayo Menulis! ✍️</h1>

        <div className={styles.levelIndicator}>
          Level Menulis: <span className={styles.levelNumber}>{level}</span>
        </div>

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

        <div className={styles.writingCard}>
          <h2 className={styles.cardTitle}>{currentContent.title}</h2>
          <p className={styles.instructions}>{currentContent.instructions}</p>

          <div className={styles.exampleContainer}>
            <p className={styles.hiddenExampleText}>
                Kata yang harus kamu tulis: "{currentExample}"
            </p>
            <button onClick={playSound} className={styles.speakButton}>
              <span role="img" aria-label="speaker">🔊</span> Dengar Suara
            </button>
          </div>

          <textarea
            className={styles.writingInput}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Tulis di sini..."
            rows="3"
          />

          <div className={styles.feedbackMessage} style={{ color: feedbackColor }}>
            {feedback}
          </div>

          <div className={styles.buttonGroup}>
            <button onClick={handleSubmit} className={styles.submitButton}>
              Periksa ✅
            </button>
            <button onClick={handleSkip} className={styles.skipButton}>
              Lewati ⏭️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingPage;