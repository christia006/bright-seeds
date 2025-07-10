import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header/Header';
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
  // Level state is still here, but its update logic is simplified
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
      // Positive feedback for kids
      setFeedback('Hebat! Betul sekali! Lanjut ke tantangan berikutnya! ✨');
      setFeedbackColor('green');
      setIsExploding(true); // Trigger confetti on correct answer

      // --- Removed user progress update logic ---
      // The section below would typically update user progress on a backend or global state.
      // Since the request is to remove saving, this block is commented/removed.

      // Example of removed level calculation logic:
      // const currentSectionProgress = currentUser.progress?.writing?.[selectedSection] || [];
      // const newCompleted = [...currentSectionProgress, currentExample];
      // const uniqueCompleted = Array.from(new Set(newCompleted));
      // let newLevel = level;
      // const totalExamples = currentContent.examples.length;
      // const completedCount = uniqueCompleted.length;
      // const threshold = currentContent.levelThreshold;
      // const calculatedLevel = Math.min(MAX_LEVEL, Math.floor(completedCount / threshold) + 1);
      // if (calculatedLevel > level) {
      //     newLevel = calculatedLevel;
      //     setFeedback('Yeay! Kamu naik ke Level ' + newLevel + '! Luar biasa! 🚀');
      //     setFeedbackColor('purple');
      // }
      // // ... similar logic for other level-up messages
      // const updatedUser = await updateUserProgess(currentUser.username, { ... });
      // setCurrentUser(updatedUser);
      // setLevel(newLevel);
      // --- End of removed logic ---

      // Automatically advance to the next question after a short delay for feedback/confetti
      setTimeout(() => {
        setIsExploding(false); // Hide confetti
        if (currentExampleIndex < currentContent.examples.length - 1) {
          setCurrentExampleIndex(currentExampleIndex + 1);
        } else {
          setCurrentExampleIndex(0); // Loop back to the first example if all are done
        }
        setUserInput(''); // Clear input for the next question
        setTimeout(() => {
          setFeedback(''); // Clear feedback message
          setFeedbackColor('');
        }, 1000); // Clear feedback after showing it briefly
      }, 1500); // Wait for confetti to finish before moving to the next question

    } else {
      // Negative feedback for kids
      setFeedback('Coba lagi, ya! Jangan menyerah! Kamu pasti bisa! 💪');
      setFeedbackColor('red');
      setIsExploding(false); // Ensure confetti is off for incorrect answers
      // Do NOT advance to the next question if the answer is incorrect
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

        {/* The level indicator will now simply reflect the initial level or a hardcoded one,
            as dynamic level updates based on user progress are removed.
            You might consider removing this if levels are no longer tracked at all. */}
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