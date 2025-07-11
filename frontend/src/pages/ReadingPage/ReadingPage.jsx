import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Header from '../../components/Header/Header';
import styles from './ReadingPage.module.css';

// --- Data untuk Game Membaca ---

// Pengenalan Huruf (A-Z)
const LETTERS_QUESTIONS = [
    { letter: 'A', audio: '/sound/a.mp3' },
    { letter: 'B', audio: '/sound/b.mp3' },
    { letter: 'C', audio: '/sound/c.mp3' },
    { letter: 'D', audio: '/sound/d.mp3' },
    { letter: 'E', audio: '/sound/e.mp3' },
    { letter: 'F', audio: '/sound/f.mp3' },
    { letter: 'G', audio: '/sound/g.mp3' },
    { letter: 'H', audio: '/sound/h.mp3' },
    { letter: 'I', audio: '/sound/i.mp3' },
    { letter: 'J', audio: '/sound/j.mp3' },
    { letter: 'K', audio: '/sound/k.mp3' },
    { letter: 'L', audio: '/sound/l.mp3' },
    { letter: 'M', audio: '/sound/m.mp3' },
    { letter: 'N', audio: '/sound/n.mp3' },
    { letter: 'O', audio: '/sound/o.mp3' },
    { letter: 'P', audio: '/sound/p.mp3' },
    { letter: 'Q', audio: '/sound/q.mp3' },
    { letter: 'R', audio: '/sound/r.mp3' },
    { letter: 'S', audio: '/sound/s.mp3' },
    { letter: 'T', audio: '/sound/t.mp3' },
    { letter: 'U', audio: '/sound/u.mp3' },
    { letter: 'V', audio: '/sound/v.mp3' },
    { letter: 'W', audio: '/sound/w.mp3' },
    { letter: 'X', audio: '/sound/x.mp3' },
    { letter: 'Y', audio: '/sound/y.mp3' },
    { letter: 'Z', audio: '/sound/z.mp3' },
];

// Mengeja Kata (30 soal, satu kata lebih dari 4 huruf)
const SYLLABLE_QUESTIONS = [
    { word: 'Meja', audio: '/sound/meja.mp3' },
    { word: 'Buku', audio: '/sounds/buku.mp3' },
    { word: 'Kursi', audio: '/sounds/kursi.mp3' },
    { word: 'Pensil', audio: '/sounds/pensil.mp3' },
    { word: 'Rumah', audio: '/sounds/rumah.mp3' },
    { word: 'Pintu', audio: '/sounds/pintu.mp3' },
    { word: 'Jendela', audio: '/sounds/jendela.mp3' },
    { word: 'Makan', audio: '/sounds/makan.mp3' },
    { word: 'Minum', audio: '/sounds/minum.mp3' },
    { word: 'Tidur', audio: '/sounds/tidur.mp3' },
    { word: 'Mandi', audio: '/sounds/mandi.mp3' },
    { word: 'Sekolah', audio: '/sounds/sekolah.mp3' },
    { word: 'Guru', audio: '/sounds/guru.mp3' },
    { word: 'Murid', audio: '/sounds/murid.mp3' },
    { word: 'Pulpen', audio: '/sounds/pulpen.mp3' },
    { word: 'Tas', audio: '/sounds/tas.mp3' },
    { word: 'Sepatu', audio: '/sounds/sepatu.mp3' },
    { word: 'Kaos', audio: '/sounds/kaos.mp3' },
    { word: 'Baju', audio: '/sounds/baju.mp3' },
    { word: 'Celana', audio: '/sounds/celana.mp3' },
    { word: 'Topi', audio: '/sounds/topi.mp3' },
    { word: 'Mata', audio: '/sounds/mata.mp3' },
    { word: 'Hidung', audio: '/sounds/hidung.mp3' },
    { word: 'Mulut', audio: '/sounds/mulut.mp3' },
    { word: 'Tangan', audio: '/sounds/tangan.mp3' },
    { word: 'Kaki', audio: '/sounds/kaki.mp3' },
    { word: 'Rambut', audio: '/sounds/rambut.mp3' },
    { word: 'Gigi', audio: '/sounds/gigi.mp3' },
    { word: 'Mobil', audio: '/sounds/mobil.mp3' },
    { word: 'Motor', audio: '/sounds/motor.mp3' },








    
];

// Membaca Kalimat Sederhana (30 soal, progresif)
const SENTENCE_QUESTIONS = [
    { sentence: 'Ini bola.', audio: '/sound/kalimat1.mp3' },
    





     { sentence: 'Kucing makan.', audio: '/sounds/kalimat2.mp3' },
    { sentence: 'Bunga itu indah.', audio: '/sounds/kalimat3.mp3' },
    { sentence: 'Ayah membaca buku.', audio: '/sounds/kalimat4.mp3' },
    { sentence: 'Ibu memasak nasi.', audio: '/sounds/kalimat5.mp3' },
    { sentence: 'Adik bermain boneka.', audio: '/sounds/kalimat6.mp3' },
    { sentence: 'Kakak pergi sekolah.', audio: '/sounds/kalimat7.mp3' },
    { sentence: 'Burung bernyanyi merdu.', audio: '/sounds/kalimat8.mp3' },
    { sentence: 'Matahari bersinar terang.', audio: '/sounds/kalimat9.mp3' },
    { sentence: 'Ayam makan jagung.', audio: '/sounds/kalimat10.mp3' },
    { sentence: 'Baju ini warna biru.', audio: '/sounds/kalimat11.mp3' },
    { sentence: 'Saya suka buah apel.', audio: '/sounds/kalimat12.mp3' },
    { sentence: 'Pohon itu sangat tinggi.', audio: '/sounds/kalimat13.mp3' },
    { sentence: 'Kereta api melaju cepat.', audio: '/sounds/kalimat14.mp3' },
    { sentence: 'Anjing itu lucu sekali.', audio: '/sounds/kalimat15.mp3' },
    { sentence: 'Kupu-kupu terbang tinggi.', audio: '/sounds/kalimat16.mp3' },
    { sentence: 'Bulan bersinar di malam hari.', audio: '/sounds/kalimat17.mp3' },
    { sentence: 'Nenek bercerita dongeng.', audio: '/sounds/kalimat18.mp3' },
    { sentence: 'Kakek duduk di kursi.', audio: '/sounds/kalimat19.mp3' },
    { sentence: 'Sepeda motor melaju kencang.', audio: '/sounds/kalimat20.mp3' },
    { sentence: 'Baju merah itu bagus.', audio: '/sounds/kalimat21.mp3' },
    { sentence: 'Saya punya banyak teman.', audio: '/sounds/kalimat22.mp3' },
    { sentence: 'Anak-anak bermain di taman.', audio: '/sounds/kalimat23.mp3' },
    { sentence: 'Pelangi itu warna-warni.', audio: '/sounds/kalimat24.mp3' },
    { sentence: 'Air sungai mengalir jernih.', audio: '/sounds/kalimat25.mp3' },
    { sentence: 'Buku cerita itu seru.', audio: '/sounds/kalimat26.mp3' },
    { sentence: 'Langit cerah hari ini.', audio: '/sounds/kalimat27.mp3' },
    { sentence: 'Mobil itu melaju pelan.', audio: '/sounds/kalimat28.mp3' },
    { sentence: 'Rumah saya dekat sekolah.', audio: '/sounds/kalimat29.mp3' },
    { sentence: 'Kami makan bersama keluarga.', audio: '/sounds/kalimat30.mp3' },
    
];

const POSITIVE_MESSAGES = [
    '🥳 Hebat!',
    '🎉 Benar sekali!',
    '🌟 Luar biasa!',
    '👍 Pintar!',
    '💯 Betul!',
    'Teruslah berlatih! ✨'
];

const NEGATIVE_MESSAGES = [
    '😔 Coba lagi ya.',
    '🤔 Hampir benar, ayo coba lagi!',
    '❌ Sayang sekali, itu salah. Kamu bisa!',
    '💡 Coba ucapkan ulang pelan-pelan.',
    'Jangan menyerah, kamu pasti bisa! 💪'
];

const ReadingPage = () => {
    const [subSection, setSubSection] = useState(null);
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('black');
    const navigate = useNavigate(); // Initialize useNavigate hook

    // State untuk Mengeja Kata
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    // State untuk Membaca Kalimat Sederhana
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

    // State umum untuk Speech Recognition
    const [isListening, setIsListening] = useState(false);
    const speechRecognitionRef = useRef(null);

    const audioRef = useRef(null); // Untuk memutar audio pertanyaan (huruf, kata, kalimat)
    const clickAudioRef = useRef(null); // Untuk memutar audio klik tombol
    const correctSoundRef = useRef(null); // Untuk memutar audio jawaban benar
    const incorrectSoundRef = useRef(null); // Untuk memutar audio jawaban salah
    const backgroundMusicRef = useRef(null); // Ref baru untuk musik latar

    // Efek samping untuk inisialisasi suara klik, suara jawaban, dan musik latar
    useEffect(() => {
        if (!clickAudioRef.current) {
            clickAudioRef.current = new Audio('/sound/tombol.mp3'); // Pastikan path ini benar
            clickAudioRef.current.volume = 0.8; // Atur volume untuk suara klik
        }
        if (!correctSoundRef.current) {
            correctSoundRef.current = new Audio('/sound/benar.mp3'); // Path untuk suara benar
            correctSoundRef.current.volume = 1.0;
        }
        if (!incorrectSoundRef.current) {
            incorrectSoundRef.current = new Audio('/sound/salah.mp3'); // Path untuk suara salah
            incorrectSoundRef.current.volume = 1.0;
        }
        // Inisialisasi musik latar
        if (!backgroundMusicRef.current) {
            backgroundMusicRef.current = new Audio('/sound/membaca.mp3'); // Path untuk musik latar
            backgroundMusicRef.current.loop = true; // Agar musik berulang
            backgroundMusicRef.current.volume = 0.3; // Sesuaikan volume agar tidak terlalu keras
        }

        // Memulai musik latar saat komponen dimuat
        const playBackgroundMusic = () => {
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.play().catch(e => console.error("Gagal memutar musik latar:", e));
            }
        };

        playBackgroundMusic();

        // Menghentikan musik saat komponen di-unmount
        return () => {
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.pause();
                backgroundMusicRef.current.currentTime = 0;
            }
        };
    }, []); // Array dependensi kosong agar hanya berjalan sekali saat mount

    // Fungsi untuk memutar suara klik
    const playClickSound = () => {
        if (clickAudioRef.current) {
            clickAudioRef.current.currentTime = 0; // Setel ulang ke awal jika sudah diputar
            clickAudioRef.current.play().catch(e => console.error("Gagal memutar suara klik:", e));
        }
    };

    // Fungsi untuk memutar suara jawaban benar
    const playCorrectSound = () => {
        if (correctSoundRef.current) {
            correctSoundRef.current.currentTime = 0;
            correctSoundRef.current.play().catch(e => console.error("Gagal memutar suara benar:", e));
        }
    };

    // Fungsi untuk memutar suara jawaban salah
    const playIncorrectSound = () => {
        if (incorrectSoundRef.current) {
            incorrectSoundRef.current.currentTime = 0;
            incorrectSoundRef.current.play().catch(e => console.error("Gagal memutar suara salah:", e));
        }
    };

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            setMessage('Maaf, browser Anda tidak mendukung fitur pengenalan suara. Silakan gunakan Chrome terbaru.');
            setMessageColor('orange');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'id-ID';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim().toLowerCase();
            setIsListening(false);

            if (subSection === 'syllables') {
                const expectedWord = SYLLABLE_QUESTIONS[currentWordIndex].word.toLowerCase();
                const normalizedTranscript = transcript.replace(/\s+/g, ' ').trim();
                const normalizedExpectedWord = expectedWord.replace(/\s+/g, ' ').trim();

                const isCorrect = normalizedTranscript.includes(normalizedExpectedWord) ||
                                 normalizedExpectedWord.includes(normalizedTranscript) ||
                                 (normalizedTranscript.length > 0 && normalizedExpectedWord.length > 0 &&
                                  normalizedTranscript[0] === normalizedExpectedWord[0] &&
                                  Math.abs(normalizedTranscript.length - normalizedExpectedWord.length) <= 2);

                if (isCorrect) {
                    playCorrectSound(); // Play correct sound
                    const positiveMsg = POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)];
                    setMessage(positiveMsg);
                    setMessageColor('green');
                    setTimeout(() => {
                        setMessage('');
                        moveToNextWord();
                    }, 1500);
                } else {
                    playIncorrectSound(); // Play incorrect sound
                    const negativeMsg = NEGATIVE_MESSAGES[Math.floor(Math.random() * NEGATIVE_MESSAGES.length)];
                    setMessage(`${negativeMsg} Kamu mengucapkan: "${transcript}". Seharusnya "${expectedWord.toUpperCase()}"`);
                    setMessageColor('red');
                    setTimeout(() => setMessage(''), 3000);
                }
            } else if (subSection === 'sentences') {
                const expectedSentence = SENTENCE_QUESTIONS[currentSentenceIndex].sentence.toLowerCase();
                const normalizedTranscript = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").trim();
                const normalizedExpected = expectedSentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").trim();

                if (normalizedTranscript === normalizedExpected) {
                    playCorrectSound(); // Play correct sound
                    const positiveMsg = POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)];
                    setMessage(positiveMsg);
                    setMessageColor('green');
                    setTimeout(() => {
                        setMessage('');
                        moveToNextSentence();
                    }, 2000);
                } else {
                    playIncorrectSound(); // Play incorrect sound
                    const negativeMsg = NEGATIVE_MESSAGES[Math.floor(Math.random() * NEGATIVE_MESSAGES.length)];
                    setMessage(`${negativeMsg} Kamu mengucapkan: "${transcript}". Seharusnya "${expectedSentence}"`);
                    setMessageColor('red');
                    setTimeout(() => setMessage(''), 4000);
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setMessage('Gagal mengenali suara. Pastikan mikrofon aktif dan izinkan akses.');
            setMessageColor('red');
            setIsListening(false);
            setTimeout(() => setMessage(''), 3000);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        speechRecognitionRef.current = recognition;

        return () => {
            if (speechRecognitionRef.current) {
                speechRecognitionRef.current.stop();
            }
        };
    }, [currentWordIndex, currentSentenceIndex, subSection]);

    // --- Fungsi Pembantu ---
    const playAudio = (audioPath) => {
        if (audioRef.current) {
            audioRef.current.src = audioPath;
            audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        }
    };

    const startListening = () => {
        playClickSound(); // Play sound when starting to listen
        if (speechRecognitionRef.current && !isListening) {
            setIsListening(true);
            setMessage('🎙️ Mendengarkan... Ucapkan dengan jelas!');
            setMessageColor('blue');
            speechRecognitionRef.current.start();
        }
    };

    // --- Logika untuk Mengeja Kata ---
    useEffect(() => {
        if (subSection === 'syllables') {
            if (currentWordIndex < SYLLABLE_QUESTIONS.length) {
                // Audio for the current word can be auto-played here if desired
                // playAudio(SYLLABLE_QUESTIONS[currentWordIndex].audio);
            } else {
                setMessage(`🎉 Selamat! Kamu telah menyelesaikan semua ${SYLLABLE_QUESTIONS.length} kata! Kamu hebat!`);
                setMessageColor('green');
                setTimeout(() => {
                    setSubSection(null);
                    setCurrentWordIndex(0);
                    setMessage('');
                }, 3000);
            }
        }
    }, [currentWordIndex, subSection]);

    const moveToNextWord = async () => {
        playClickSound(); // Play sound when moving to next word
        if (currentWordIndex < SYLLABLE_QUESTIONS.length - 1) {
            setCurrentWordIndex(prevIndex => prevIndex + 1);
            setMessage('');
        } else {
            setMessage(`🎉 Selamat! Kamu telah menyelesaikan semua ${SYLLABLE_QUESTIONS.length} kata! Kamu hebat!`);
            setMessageColor('green');
            setTimeout(() => {
                setSubSection(null);
                setCurrentWordIndex(0);
                setMessage('');
            }, 3000);
        }
    };

    // --- Logika untuk Membaca Kalimat Sederhana ---
    useEffect(() => {
        if (subSection === 'sentences') {
            if (currentSentenceIndex < SENTENCE_QUESTIONS.length) {
                // Audio for the current sentence can be auto-played here
                // playAudio(SENTENCE_QUESTIONS[currentSentenceIndex].audio);
            } else {
                setMessage(`🎉 Selamat! Kamu telah membaca semua ${SENTENCE_QUESTIONS.length} kalimat! Kamu pembaca hebat!`);
                setMessageColor('green');
                setTimeout(() => {
                    setSubSection(null);
                    setCurrentSentenceIndex(0);
                    setMessage('');
                }, 3000);
            }
        }
    }, [currentSentenceIndex, subSection]);

    const moveToNextSentence = async () => {
        playClickSound(); // Play sound when moving to next sentence
        if (currentSentenceIndex < SENTENCE_QUESTIONS.length - 1) {
            setCurrentSentenceIndex(prevIndex => prevIndex + 1);
            setMessage('');
        } else {
            setMessage(`🎉 Selamat! Kamu telah membaca semua ${SENTENCE_QUESTIONS.length} kalimat! Kamu pembaca hebat!`);
            setMessageColor('green');
            setTimeout(() => {
                setSubSection(null);
                setCurrentSentenceIndex(0);
                setMessage('');
            }, 3000);
        }
    };

    // Handler for navigating to Dashboard
    const handleGoToDashboard = () => {
        playClickSound(); // Play sound on Dashboard button click
        navigate('/dashboard'); // Assuming your Dashboard route is '/dashboard'
    };

    // --- Render Konten Game ---
    const renderContent = () => {
        switch (subSection) {
            case 'letters':
                return (
                    <div className={styles.card}>
                        <h3>🔤 Pengenalan Huruf (A-Z)</h3>
                    
                        <div className={styles.letterGrid}>
                            {LETTERS_QUESTIONS.map((item, index) => (
                                <div
                                    key={index}
                                    className={styles.letterBox}
                                    onClick={() => {
                                        playAudio(item.audio);
                                        playClickSound(); // Play sound when clicking a letter box
                                    }}
                                >
                                    {item.letter}
                                </div>
                            ))}
                        </div>

                        <audio ref={audioRef} preload="auto"></audio>

                        {message && <p style={{ color: messageColor, fontWeight: 'bold', marginTop: '15px' }}>{message}</p>}

                        <button onClick={() => {
                            playClickSound(); // Play sound when returning to menu
                            setSubSection(null);
                            setMessage(''); // Pastikan pesan dihapus saat kembali ke menu utama
                        }} className={`${styles.actionButton} ${styles.secondaryButton}`}>
                            Kembali ke Menu
                        </button>
                    </div>
                );

            case 'syllables':
                const currentWord = SYLLABLE_QUESTIONS[currentWordIndex];
                return (
                    <div className={styles.card}>
                        <h3>📖 Mengeja Kata</h3>
                        <p className={styles.questionText}>Coba ucapkan kata ini:</p>
                        <h1 className={styles.syllableText}>{currentWord.word}</h1>

                        <audio ref={audioRef} preload="auto"></audio>

                        <div className={styles.buttonGroup}>
                            <button
                                onClick={startListening}
                                disabled={isListening}
                                className={`${styles.actionButton} ${isListening ? styles.listeningButton : styles.primaryButton}`}
                            >
                                {isListening ? 'Berbicara...' : 'Ucapkan Kata'} <span role="img" aria-label="microphone">🎤</span>
                            </button>
                        </div>
                        {message && <p style={{ color: messageColor, fontWeight: 'bold', marginTop: '15px' }}>{message}</p>}
                        <p className={styles.progressText}>
                            Soal ke: {currentWordIndex + 1} dari {SYLLABLE_QUESTIONS.length}
                        </p>

                        <button onClick={() => {
                            playClickSound(); // Play sound when returning to menu
                            setSubSection(null);
                            setCurrentWordIndex(0);
                            setMessage('');
                        }} className={`${styles.actionButton} ${styles.secondaryButton}`}>
                            Kembali ke Menu
                        </button>
                        {currentWordIndex < SYLLABLE_QUESTIONS.length - 1 && (
                            <button onClick={moveToNextWord} className={`${styles.actionButton} ${styles.skipButton}`}>
                                Lewati ➡️
                            </button>
                        )}
                    </div>
                );

            case 'sentences':
                const currentSentence = SENTENCE_QUESTIONS[currentSentenceIndex];
                return (
                    <div className={styles.card}>
                        <h3>📚 Membaca Kalimat Sederhana</h3>
                        <p className={styles.questionText}>Ayo kita baca kalimat pendek ini:</p>
                        <h1 className={styles.sentenceText}>{currentSentence.sentence}</h1>

                        <audio ref={audioRef} preload="auto"></audio>

                        <div className={styles.buttonGroup}>
                            <button
                                onClick={startListening}
                                disabled={isListening}
                                className={`${styles.actionButton} ${isListening ? styles.listeningButton : styles.primaryButton}`}
                            >
                                {isListening ? 'Berbicara...' : 'Ucapkan Kalimat'} <span role="img" aria-label="microphone">🎤</span>
                            </button>
                        </div>
                        {message && <p style={{ color: messageColor, fontWeight: 'bold', marginTop: '15px' }}>{message}</p>}
                        <p className={styles.progressText}>
                            Soal ke: {currentSentenceIndex + 1} dari {SENTENCE_QUESTIONS.length}
                        </p>

                        <button onClick={() => {
                            playClickSound(); // Play sound when returning to menu
                            setSubSection(null);
                            setCurrentSentenceIndex(0);
                            setMessage('');
                        }} className={`${styles.actionButton} ${styles.secondaryButton}`}>
                            Kembali ke Menu
                        </button>
                        {currentSentenceIndex < SENTENCE_QUESTIONS.length - 1 && (
                            <button onClick={moveToNextSentence} className={`${styles.actionButton} ${styles.skipButton}`}>
                                Lewati ➡️
                            </button>
                        )}
                    </div>
                );

            default:
                return (
                    <div className={styles.card}>
                        <h3>Ayo Belajar Membaca! 🤓</h3>
                        <p className={styles.descriptionText}>Pilih petualangan membaca yang ingin kamu mulai:</p>
                        <div className={styles.menuGrid}>
                            <button onClick={() => {
                                playClickSound(); // Play sound when clicking menu card
                                setSubSection('letters');
                            }} className={styles.menuCard}>
                                Pengenalan Huruf <span role="img" aria-label="letters">🅰️🅱️🆎</span>
                            </button>
                            <button onClick={() => {
                                playClickSound(); // Play sound when clicking menu card
                                setSubSection('syllables');
                            }} className={styles.menuCard}>
                                Mengeja Kata <span role="img" aria-label="syllables">K🅰️T🅰️</span>
                            </button>
                            <button onClick={() => {
                                playClickSound(); // Play sound when clicking menu card
                                setSubSection('sentences');
                            }} className={styles.menuCard}>
                                Membaca Kalimat Sederhana <span role="img" aria-label="sentences">📚✨</span>
                            </button>
                        </div>
                        {/* New Dashboard Button */}
                        <button 
                            onClick={handleGoToDashboard} 
                            className={`${styles.actionButton} ${styles.dashboardButton}`}
                            style={{ backgroundColor: '#4CAF50', color: 'white', marginTop: '20px' }} // Example inline style, prefer CSS module
                        >
                            <span role="img" aria-label="dashboard">📊</span> Dashboard
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Header />
            <div className={styles.contentArea}>
                {renderContent()}
            </div>
        </div>
    );
};

export default ReadingPage;
