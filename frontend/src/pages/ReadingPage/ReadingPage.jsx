import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header/Header'; // Perbaikan path
import { updateUserProgess } from '../../services/userService';
import styles from './ReadingPage.module.css'; // Import CSS Module

// --- Data untuk Game Membaca ---

// Pengenalan Huruf (30 soal, bisa diulang-ulang atau dengan target tertentu)
const LETTERS_QUESTIONS = [
    { letter: 'A', audio: '/sounds/a.mp3' }, { letter: 'B', audio: '/sounds/b.mp3' },
    { letter: 'C', audio: '/sounds/c.mp3' }, { letter: 'D', audio: '/sounds/d.mp3' },
    { letter: 'E', audio: '/sounds/e.mp3' }, { letter: 'F', audio: '/sounds/f.mp3' },
    { letter: 'G', audio: '/sounds/g.mp3' }, { letter: 'H', audio: '/sounds/h.mp3' },
    { letter: 'I', audio: '/sounds/i.mp3' }, { letter: 'J', audio: '/sounds/j.mp3' },
    { letter: 'K', audio: '/sounds/k.mp3' }, { letter: 'L', audio: '/sounds/l.mp3' },
    { letter: 'M', audio: '/sounds/m.mp3' }, { letter: 'N', audio: '/sounds/n.mp3' },
    { letter: 'O', audio: '/sounds/o.mp3' }, { letter: 'P', audio: '/sounds/p.mp3' },
    { letter: 'Q', audio: '/sounds/q.mp3' }, { letter: 'R', audio: '/sounds/r.mp3' },
    { letter: 'S', audio: '/sounds/s.mp3' }, { letter: 'T', audio: '/sounds/t.mp3' },
    { letter: 'U', audio: '/sounds/u.mp3' }, { letter: 'V', audio: '/sounds/v.mp3' },
    { letter: 'W', audio: '/sounds/w.mp3' }, { letter: 'X', audio: '/sounds/x.mp3' },
    { letter: 'Y', audio: '/sounds/y.mp3' }, { letter: 'Z', audio: '/sounds/z.mp3' },
    // Tambahan untuk mencapai 30 soal (bisa pengulangan atau variasi huruf kecil/besar, atau kombinasi)
    { letter: 'a', audio: '/sounds/a.mp3' }, { letter: 'b', audio: '/sounds/b.mp3' },
    { letter: 'c', audio: '/sounds/c.mp3' }, { letter: 'd', audio: '/sounds/d.mp3' }
];

// Mengeja Suku Kata (30 soal)
const SYLLABLE_QUESTIONS = [
    { syllable: 'Ba', audio: '/sounds/ba.mp3', exampleWord: 'Baju' },
    { syllable: 'Bi', audio: '/sounds/bi.mp3', exampleWord: 'Bintang' },
    { syllable: 'Bu', audio: '/sounds/bu.mp3', exampleWord: 'Buku' },
    { syllable: 'Be', audio: '/sounds/be.mp3', exampleWord: 'Bebek' },
    { syllable: 'Bo', audio: '/sounds/bo.mp3', exampleWord: 'Bola' },
    { syllable: 'Ca', audio: '/sounds/ca.mp3', exampleWord: 'Cacing' },
    { syllable: 'Ci', audio: '/sounds/ci.mp3', exampleWord: 'Cincin' },
    { syllable: 'Cu', audio: '/sounds/cu.mp3', exampleWord: 'Cumi' },
    { syllable: 'Ce', audio: '/sounds/ce.mp3', exampleWord: 'Cepat' },
    { syllable: 'Co', audio: '/sounds/co.mp3', exampleWord: 'Cokelat' },
    { syllable: 'Da', audio: '/sounds/da.mp3', exampleWord: 'Daun' },
    { syllable: 'Di', audio: '/sounds/di.mp3', exampleWord: 'Dino' },
    { syllable: 'Du', audio: '/sounds/du.mp3', exampleWord: 'Duri' },
    { syllable: 'De', audio: '/sounds/de.mp3', exampleWord: 'Detik' },
    { syllable: 'Do', audio: '/sounds/do.mp3', exampleWord: 'Dompet' },
    { syllable: 'Fa', audio: '/sounds/fa.mp3', exampleWord: 'Foto' },
    { syllable: 'Fi', audio: '/sounds/fi.mp3', exampleWord: 'Fitur' },
    { syllable: 'Fu', audio: '/sounds/fu.mp3', exampleWord: 'Fungsi' },
    { syllable: 'Fe', audio: '/sounds/fe.mp3', exampleWord: 'Ferdy' },
    { syllable: 'Fo', audio: '/sounds/fo.mp3', exampleWord: 'Fokus' },
    { syllable: 'Ga', audio: '/sounds/ga.mp3', exampleWord: 'Gajah' },
    { syllable: 'Gi', audio: '/sounds/gi.mp3', exampleWord: 'Gigi' },
    { syllable: 'Gu', audio: '/sounds/gu.mp3', exampleWord: 'Gula' },
    { syllable: 'Ge', audio: '/sounds/ge.mp3', exampleWord: 'Gelas' },
    { syllable: 'Go', audio: '/sounds/go.mp3', exampleWord: 'Gorila' },
    { syllable: 'Ha', audio: '/sounds/ha.mp3', exampleWord: 'Hantu' },
    { syllable: 'Hi', audio: '/sounds/hi.mp3', exampleWord: 'Hijau' },
    { syllable: 'Hu', audio: '/sounds/hu.mp3', exampleWord: 'Hutan' },
    { syllable: 'He', audio: '/sounds/he.mp3', exampleWord: 'Hewan' },
    { syllable: 'Ho', audio: '/sounds/ho.mp3', exampleWord: 'Hotel' },
];

// Membaca Kalimat Sederhana (30 soal, progresif)
const SENTENCE_QUESTIONS = [
    { sentence: 'Ini bola.', audio: '/sounds/kalimat1.mp3' },
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

const ReadingPage = ({ currentUser, setCurrentUser }) => {
    const [subSection, setSubSection] = useState(null);
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('black');

    // State untuk Pengenalan Huruf
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [currentLetter, setCurrentLetter] = useState('');
    const [letterQuizActive, setLetterQuizActive] = useState(false);
    const [letterScore, setLetterScore] = useState(0);

    // State untuk Mengeja Suku Kata
    const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);

    // State untuk Membaca Kalimat Sederhana
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

    // State umum untuk Speech Recognition
    const [isListening, setIsListening] = useState(false);
    const speechRecognitionRef = useRef(null); // Gunakan ref untuk speechRecognition

    const audioRef = useRef(null); // Untuk memutar audio

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

            if (subSection === 'letters' && letterQuizActive) {
                const expectedLetter = LETTERS_QUESTIONS[currentLetterIndex].letter.toLowerCase();
                if (transcript === expectedLetter) {
                    const positiveMsg = POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)];
                    setMessage(positiveMsg);
                    setMessageColor('green');
                    setLetterScore(prev => prev + 1);
                    setTimeout(() => {
                        setMessage('');
                        moveToNextLetter();
                    }, 1500);
                } else {
                    const negativeMsg = NEGATIVE_MESSAGES[Math.floor(Math.random() * NEGATIVE_MESSAGES.length)];
                    setMessage(`${negativeMsg} Kamu mengucapkan: "${transcript}". Seharusnya "${expectedLetter.toUpperCase()}"`);
                    setMessageColor('red');
                    setTimeout(() => setMessage(''), 3000);
                }
            } else if (subSection === 'syllables') {
                const expectedSyllable = SYLLABLE_QUESTIONS[currentSyllableIndex].syllable.toLowerCase();
                if (transcript === expectedSyllable) {
                    const positiveMsg = POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)];
                    setMessage(positiveMsg);
                    setMessageColor('green');
                    setTimeout(() => {
                        setMessage('');
                        moveToNextSyllable();
                    }, 1500);
                } else {
                    const negativeMsg = NEGATIVE_MESSAGES[Math.floor(Math.random() * NEGATIVE_MESSAGES.length)];
                    setMessage(`${negativeMsg} Kamu mengucapkan: "${transcript}". Seharusnya "${expectedSyllable.toUpperCase()}"`);
                    setMessageColor('red');
                    setTimeout(() => setMessage(''), 3000);
                }
            } else if (subSection === 'sentences') {
                const expectedSentence = SENTENCE_QUESTIONS[currentSentenceIndex].sentence.toLowerCase();
                // Simple check: compare normalized strings. For better accuracy, need more advanced NLP.
                const normalizedTranscript = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ");
                const normalizedExpected = expectedSentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ");

                if (normalizedTranscript === normalizedExpected) {
                    const positiveMsg = POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)];
                    setMessage(positiveMsg);
                    setMessageColor('green');
                    setTimeout(() => {
                        setMessage('');
                        moveToNextSentence();
                    }, 2000);
                } else {
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
    }, [currentLetterIndex, currentSyllableIndex, currentSentenceIndex, subSection, letterQuizActive]);

    // --- Fungsi Pembantu ---
    const playAudio = (audioPath) => {
        if (audioRef.current) {
            audioRef.current.src = audioPath;
            audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        }
    };

    const startListening = () => {
        if (speechRecognitionRef.current && !isListening) {
            setIsListening(true);
            setMessage('🎙️ Mendengarkan... Ucapkan dengan jelas!');
            setMessageColor('blue');
            speechRecognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (speechRecognitionRef.current && isListening) {
            speechRecognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const handleCompleteActivity = async (activityType, newLevel = 1) => {
        try {
            // Dapatkan progress membaca saat ini, atau inisialisasi jika belum ada
            const currentReadingProgress = currentUser?.progress?.reading || {
                level: 1, // Default level jika tidak ada
                letters: [],
                syllables: [],
                sentences: []
            };

            // Tandai aktivitas sebagai selesai
            const updatedActivityProgress = [...(currentReadingProgress[activityType] || []), 'completed'];

            // Hitung level baru (misalnya, level tertinggi dari semua aktivitas yang selesai, atau akumulatif)
            // Untuk simplicity, kita akan set level berdasarkan level yang diberikan dari fungsi ini.
            const calculatedNewLevel = Math.max(currentReadingProgress.level, newLevel);


            const updatedProgress = {
                reading: {
                    ...currentReadingProgress, // Pertahankan progress aktivitas lain
                    [activityType]: updatedActivityProgress, // Update progress aktivitas spesifik
                    level: calculatedNewLevel // Update level keseluruhan
                }
            };

            const updatedUser = await updateUserProgess(currentUser.username, updatedProgress);
            setCurrentUser(updatedUser);
            setMessage(`Progress ${activityType} kamu tersimpan! Level Reading: ${calculatedNewLevel} 🎉`);
            setMessageColor('green');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Gagal menyimpan progress: ' + error.message);
            setMessageColor('red');
        }
    };


    // --- Logika untuk Pengenalan Huruf ---
    useEffect(() => {
        if (subSection === 'letters' && letterQuizActive) {
            if (currentLetterIndex < LETTERS_QUESTIONS.length) {
                setCurrentLetter(LETTERS_QUESTIONS[currentLetterIndex].letter);
                // playAudio(LETTERS_QUESTIONS[currentLetterIndex].audio); // Auto-play saat memulai quiz
            } else {
                setMessage(`🎉 Selamat! Kamu berhasil mengenali semua ${LETTERS_QUESTIONS.length} huruf!`);
                setMessageColor('green');
                setLetterQuizActive(false);
                handleCompleteActivity('letters', 2); // Naikkan level Reading setelah selesai
            }
        }
    }, [currentLetterIndex, letterQuizActive, subSection]); // Dependensi yang lebih spesifik

    const moveToNextLetter = () => {
        setCurrentLetterIndex(prevIndex => prevIndex + 1);
        setMessage('');
    };


    // --- Logika untuk Mengeja Suku Kata ---
    useEffect(() => {
        if (subSection === 'syllables') {
            if (currentSyllableIndex < SYLLABLE_QUESTIONS.length) {
                // Initial load or after moving to next, play audio
                // playSyllableAudio(SYLLABLE_QUESTIONS[currentSyllableIndex].audio);
            } else {
                setMessage(`🎉 Selamat! Kamu telah menyelesaikan semua ${SYLLABLE_QUESTIONS.length} suku kata! Kamu hebat!`);
                setMessageColor('green');
                handleCompleteActivity('syllables', 3); // Naikkan level Reading
                setTimeout(() => {
                    setSubSection(null);
                    setCurrentSyllableIndex(0);
                }, 3000);
            }
        }
    }, [currentSyllableIndex, subSection]); // Dependencies to re-run effect

    const moveToNextSyllable = async () => {
        if (currentSyllableIndex < SYLLABLE_QUESTIONS.length - 1) {
            setCurrentSyllableIndex(prevIndex => prevIndex + 1);
            setMessage('');
        } else {
            // Handle completion:
            setMessage(`🎉 Selamat! Kamu telah menyelesaikan semua ${SYLLABLE_QUESTIONS.length} suku kata! Kamu hebat!`);
            setMessageColor('green');
            await handleCompleteActivity('syllables', 3); // Naikkan level Reading setelah selesai
            setTimeout(() => {
                setSubSection(null);
                setCurrentSyllableIndex(0);
            }, 3000);
        }
    };

    // --- Logika untuk Membaca Kalimat Sederhana ---
    useEffect(() => {
        if (subSection === 'sentences') {
            if (currentSentenceIndex < SENTENCE_QUESTIONS.length) {
                // Optionally auto-play sentence audio here
                // playAudio(SENTENCE_QUESTIONS[currentSentenceIndex].audio);
            } else {
                setMessage(`🎉 Selamat! Kamu telah membaca semua ${SENTENCE_QUESTIONS.length} kalimat! Kamu pembaca hebat!`);
                setMessageColor('green');
                handleCompleteActivity('sentences', 4); // Naikkan level Reading
                setTimeout(() => {
                    setSubSection(null);
                    setCurrentSentenceIndex(0);
                }, 3000);
            }
        }
    }, [currentSentenceIndex, subSection]);

    const moveToNextSentence = async () => {
        if (currentSentenceIndex < SENTENCE_QUESTIONS.length - 1) {
            setCurrentSentenceIndex(prevIndex => prevIndex + 1);
            setMessage('');
        } else {
            // Handle completion
            setMessage(`🎉 Selamat! Kamu telah membaca semua ${SENTENCE_QUESTIONS.length} kalimat! Kamu pembaca hebat!`);
            setMessageColor('green');
            await handleCompleteActivity('sentences', 4); // Naikkan level Reading setelah selesai
            setTimeout(() => {
                setSubSection(null);
                setCurrentSentenceIndex(0);
            }, 3000);
        }
    };


    // --- Render Konten Game ---
    const renderContent = () => {
        switch (subSection) {
            case 'letters':
                return (
                    <div className={styles.card}>
                        <h3>🔤 Pengenalan Huruf (A-Z)</h3>
                        <p className={styles.descriptionText}>Yuk, kenali dan ucapkan huruf-huruf ini!</p>

                        <div className={styles.letterGrid}>
                            {LETTERS_QUESTIONS.map((item, index) => (
                                <div
                                    key={index}
                                    className={`${styles.letterBox} ${letterQuizActive && index === currentLetterIndex ? styles.activeLetter : ''}`}
                                    onClick={() => playAudio(item.audio)}
                                >
                                    {item.letter}
                                </div>
                            ))}
                        </div>

                        <audio ref={audioRef} preload="auto"></audio>

                        {!letterQuizActive ? (
                            <button
                                onClick={() => {
                                    setLetterQuizActive(true);
                                    setCurrentLetterIndex(0);
                                    setMessage('Sekarang, ayo tebak hurufnya!');
                                    setMessageColor('black');
                                    playAudio(LETTERS_QUESTIONS[0].audio); // Putar audio huruf pertama
                                }}
                                className={`${styles.actionButton} ${styles.primaryButton}`}
                            >
                                Mulai Tebak Huruf! ✨
                            </button>
                        ) : (
                            <>
                                <p className={styles.questionText}>Sekarang, coba ucapkan huruf ini:</p>
                                <h1 className={styles.syllableText}>{currentLetter}</h1>
                                <div className={styles.buttonGroup}>
                                    <button onClick={() => playAudio(LETTERS_QUESTIONS[currentLetterIndex].audio)} className={`${styles.actionButton} ${styles.infoButton}`}>
                                        Dengar Huruf <span role="img" aria-label="speaker">🔊</span>
                                    </button>
                                    <button
                                        onClick={startListening}
                                        disabled={isListening}
                                        className={`${styles.actionButton} ${isListening ? styles.listeningButton : styles.primaryButton}`}
                                    >
                                        {isListening ? 'Berbicara...' : 'Ucapkan Huruf'} <span role="img" aria-label="microphone">🎤</span>
                                    </button>
                                </div>
                                {message && <p style={{ color: messageColor, fontWeight: 'bold', marginTop: '15px' }}>{message}</p>}
                                <p className={styles.progressText}>
                                    Soal ke: {currentLetterIndex + 1} dari {LETTERS_QUESTIONS.length}
                                </p>
                            </>
                        )}
                        <button onClick={() => {
                            setSubSection(null);
                            setCurrentLetterIndex(0);
                            setLetterQuizActive(false);
                            setMessage('');
                        }} className={`${styles.actionButton} ${styles.secondaryButton}`}>
                            Kembali ke Menu
                        </button>
                        {letterQuizActive && currentLetterIndex < LETTERS_QUESTIONS.length - 1 && (
                            <button onClick={moveToNextLetter} className={`${styles.actionButton} ${styles.skipButton}`}>
                                Lewati (Huruf Baru) ➡️
                            </button>
                        )}
                         {/* Menyimpan progress saat keluar dari game */}
                         <button onClick={() => handleCompleteActivity('letters', 1)} className={`${styles.actionButton} ${styles.primaryButton}`}>
                            Selesai Pengenalan Huruf
                        </button>
                    </div>
                );

            case 'syllables':
                const currentSyllable = SYLLABLE_QUESTIONS[currentSyllableIndex];
                return (
                    <div className={styles.card}>
                        <h3>📖 Mengeja Suku Kata</h3>
                        <p className={styles.questionText}>Coba ucapkan suku kata ini:</p>
                        <h1 className={styles.syllableText}>{currentSyllable.syllable}</h1>
                        {currentSyllable.exampleWord && (
                            <p className={styles.exampleWordText}>Contoh kata: **{currentSyllable.exampleWord}**</p>
                        )}

                        <audio ref={audioRef} preload="auto"></audio>

                        <div className={styles.buttonGroup}>
                            <button onClick={() => playAudio(currentSyllable.audio)} className={`${styles.actionButton} ${styles.infoButton}`}>
                                Dengar Suku Kata <span role="img" aria-label="speaker">🔊</span>
                            </button>
                            <button
                                onClick={startListening}
                                disabled={isListening}
                                className={`${styles.actionButton} ${isListening ? styles.listeningButton : styles.primaryButton}`}
                            >
                                {isListening ? 'Berbicara...' : 'Ucapkan Suku Kata'} <span role="img" aria-label="microphone">🎤</span>
                            </button>
                        </div>
                        {message && <p style={{ color: messageColor, fontWeight: 'bold', marginTop: '15px' }}>{message}</p>}
                        <p className={styles.progressText}>
                            Soal ke: {currentSyllableIndex + 1} dari {SYLLABLE_QUESTIONS.length}
                        </p>

                        <button onClick={() => {
                            setSubSection(null);
                            setCurrentSyllableIndex(0);
                            setMessage('');
                        }} className={`${styles.actionButton} ${styles.secondaryButton}`}>
                            Kembali ke Menu
                        </button>
                        {currentSyllableIndex < SYLLABLE_QUESTIONS.length - 1 && (
                            <button onClick={moveToNextSyllable} className={`${styles.actionButton} ${styles.skipButton}`}>
                                Lewati (Soal Baru) ➡️
                            </button>
                        )}
                        {/* Menyimpan progress saat keluar dari game */}
                        <button onClick={() => handleCompleteActivity('syllables', 2)} className={`${styles.actionButton} ${styles.primaryButton}`}>
                            Selesai Mengeja Suku Kata
                        </button>
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
                            <button onClick={() => playAudio(currentSentence.audio)} className={`${styles.actionButton} ${styles.infoButton}`}>
                                Dengar Kalimat <span role="img" aria-label="speaker">🔊</span>
                            </button>
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
                            setSubSection(null);
                            setCurrentSentenceIndex(0);
                            setMessage('');
                        }} className={`${styles.actionButton} ${styles.secondaryButton}`}>
                            Kembali ke Menu
                        </button>
                        {currentSentenceIndex < SENTENCE_QUESTIONS.length - 1 && (
                            <button onClick={moveToNextSentence} className={`${styles.actionButton} ${styles.skipButton}`}>
                                Lewati (Kalimat Baru) ➡️
                            </button>
                        )}
                        {/* Menyimpan progress saat keluar dari game */}
                        <button onClick={() => handleCompleteActivity('sentences', 3)} className={`${styles.actionButton} ${styles.primaryButton}`}>
                            Selesai Membaca Kalimat
                        </button>
                    </div>
                );

            default:
                return (
                    <div className={styles.card}>
                        <h3>Ayo Belajar Membaca! 🤓</h3>
                        <p className={styles.descriptionText}>Pilih petualangan membaca yang ingin kamu mulai:</p>
                        <div className={styles.menuGrid}>
                            <button onClick={() => setSubSection('letters')} className={styles.menuCard}>
                                Pengenalan Huruf <span role="img" aria-label="letters">🅰️🅱️🆎</span>
                            </button>
                            <button onClick={() => setSubSection('syllables')} className={styles.menuCard}>
                                Mengeja Suku Kata <span role="img" aria-label="syllables">K🅰️T🅰️</span>
                            </button>
                            <button onClick={() => setSubSection('sentences')} className={styles.menuCard}>
                                Membaca Kalimat Sederhana <span role="img" aria-label="sentences">📚✨</span>
                            </button>
                        </div>
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