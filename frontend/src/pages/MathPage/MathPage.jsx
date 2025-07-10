import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header/Header';
import styles from './MathPage.module.css'; // Pastikan path ini benar
import ConfettiExplosion from 'react-confetti-explosion'; // Import Confetti
import { useNavigate } from 'react-router-dom'; // Import useNavigate untuk navigasi

// Helper function untuk menghasilkan angka acak
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function untuk menghasilkan soal matematika
const generateCountingQuestion = () => {
    const count = getRandomNumber(5, 30); // Hitung objek hingga 30
    const objectTypes = [
        { name: 'apel', emoji: '🍎' },
        { name: 'bintang', emoji: '⭐' },
        { name: 'bola', emoji: '⚽' },
        { name: 'bunga', emoji: '🌸' },
        { name: 'ikan', emoji: '🐠' },
        { name: 'kupu-kupu', emoji: '🦋' },
        { name: 'es krim', emoji: '🍦' },
        { name: 'kue', emoji: '🍰' },
        { name: 'mobil', emoji: '🚗' },
        { name: 'pesawat', emoji: '✈️' },
        { name: 'pensil', emoji: '✏️' },
        { name: 'buku', emoji: '📚' },
        { name: 'kucing', emoji: '🐱' },
        { name: 'anjing', emoji: '🐶' }
    ];
    const selectedObjectType = objectTypes[getRandomNumber(0, objectTypes.length - 1)];
    const objects = Array(count).fill(selectedObjectType.emoji);
    return {
        question: `Ada berapa ${selectedObjectType.name} ini? ${objects.join('')}`,
        answer: count,
        soundText: `Ada berapa ${selectedObjectType.name} ini`, // Teks untuk dibacakan
        type: 'counting'
    };
};

const generateAdditionQuestion = () => {
    const num1 = getRandomNumber(5, 20); // Angka lebih besar
    const num2 = getRandomNumber(5, 20);
    return {
        question: `${num1} + ${num2} = ?`,
        answer: num1 + num2,
        soundText: `${num1} tambah ${num2} sama dengan berapa`, // Teks untuk dibacakan
        type: 'addition'
    };
};

const generateSubtractionQuestion = () => {
    let num1 = getRandomNumber(10, 30); // Angka lebih besar
    let num2 = getRandomNumber(5, num1 - 5); // Pastikan hasil positif dan cukup besar
    return {
        question: `${num1} - ${num2} = ?`,
        answer: num1 - num2,
        soundText: `${num1} kurang ${num2} sama dengan berapa`, // Teks untuk dibacakan
        type: 'subtraction'
    };
};

// Helper function untuk menghasilkan daftar angka 1-100
const generateNumbersList = () => {
    const numbers = [];
    for (let i = 1; i <= 100; i++) {
        numbers.push({ number: i, soundText: `${i}` });
    }
    return numbers;
};

const mathContent = {
    counting: {
        title: "Menghitung Objek",
        instructions: "Hitung objek-objek lucu ini dan ketikkan jawabannya!",
        generateQuestion: generateCountingQuestion,
        showSoundButton: true,
    },
    addition: {
        title: "Penjumlahan Seru",
        instructions: "Ayo tambahkan angka-angka ini dan temukan jawabannya!",
        generateQuestion: generateAdditionQuestion,
        showSoundButton: true,
    },
    subtraction: {
        title: "Pengurangan Asyik",
        instructions: "Kurangkan angka-angka ini dan cari tahu sisanya!",
        generateQuestion: generateSubtractionQuestion,
        showSoundButton: true,
    },
    numbersList: {
        title: "Daftar Angka 1-100",
        instructions: "Klik angka untuk mendengarnya atau lihat urutannya!",
        generateContent: generateNumbersList, // Gunakan generateContent untuk ini
        showSoundButton: false, // Tidak ada tombol sound soal utama di sini
    }
};

// Define getSoundPath function here
const getSoundPath = (fileName, type) => {
    switch (type) {
        case 'feedback':
            return `/sounds/feedback/${fileName}.mp3`;
        case 'number':
            return `/sounds/numbers/${fileName}.mp3`;
        case 'math_question':
            const formattedFileName = fileName.replace(/ /g, '-').toLowerCase();
            return `/sounds/questions/${formattedFileName}.mp3`;
        default:
            return null;
    }
};

const MathPage = () => {
    const [selectedSection, setSelectedSection] = useState('counting');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [numbersData, setNumbersData] = useState([]); // State baru untuk daftar angka
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('');
    const [isExploding, setIsExploding] = useState(false);

    const audioRef = useRef(new Audio());
    const navigate = useNavigate();

    // Effect untuk memuat soal awal atau daftar angka saat komponen dimuat atau bagian berubah
    useEffect(() => {
        if (selectedSection === 'numbersList') {
            setNumbersData(mathContent[selectedSection].generateContent());
            setCurrentQuestion(null); // Pastikan soal matematika disembunyikan
        } else {
            loadNewQuestion();
            setNumbersData([]); // Pastikan daftar angka disembunyikan
        }
    }, [selectedSection]);

    // Fungsi untuk memuat soal baru
    const loadNewQuestion = () => {
        const newQuestion = mathContent[selectedSection].generateQuestion();
        setCurrentQuestion(newQuestion);
        setUserInput('');
        setFeedback('');
        setFeedbackColor('');
        setIsExploding(false);
    };

    // General sound player untuk berbagai jenis (soal, angka, umpan balik)
    const playSound = (textToSpeak, soundType = 'question') => {
        if (!textToSpeak) return;

        let path;
        if (soundType === 'feedback') { // Handle specific feedback sound type
            path = getSoundPath(textToSpeak, 'feedback');
        } else if (soundType === 'number') {
            path = getSoundPath(textToSpeak, 'number');
        } else {
            path = getSoundPath(textToSpeak, 'math_question');
        }

        if (path) {
            audioRef.current.src = path;
            audioRef.current.play().catch(e => {
                console.warn(`Error playing sound from file (${path}), falling back to Web Speech API:`, e);
                // Fallback to Web Speech API only for question/number sounds, not for feedback
                if (soundType !== 'feedback') {
                    playWebSpeech(textToSpeak);
                }
            });
        } else {
            console.warn(`No specific sound file found for "${textToSpeak}" (type: ${soundType}), falling back to Web Speech API.`);
            if (soundType !== 'feedback') {
                playWebSpeech(textToSpeak);
            }
        }
    };

    // Fallback ke Web Speech API (Text-to-Speech)
    const playWebSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance(text);
            msg.lang = 'id-ID';
            msg.rate = 0.7;
            msg.pitch = 1.0;

            const voices = window.speechSynthesis.getVoices();
            const indoVoice = voices.find(voice => voice.lang === 'id-ID' && (voice.name.includes('Google Bahasa Indonesia') || voice.name.includes('ID')));
            if (indoVoice) {
                msg.voice = indoVoice;
            } else {
                console.warn("No specific Indonesian voice found, using default browser voice.");
            }

            window.speechSynthesis.speak(msg);
        } else {
            console.error("Browser Anda tidak mendukung Web Speech API.");
            setFeedback("Maaf, browser Anda tidak mendukung fitur suara.");
            setFeedbackColor("orange");
        }
    };

    // Handler untuk jawaban benar
    const handleCorrectAnswer = () => {
        playSound('benar-pula', 'feedback'); // Play specific correct feedback sound
        setFeedback('Hebat! Jawabanmu benar! 🎉 Lanjut ke soal berikutnya!');
        setFeedbackColor('green');
        setIsExploding(true);

        setTimeout(() => {
            setIsExploding(false);
            loadNewQuestion();
            setTimeout(() => { setFeedback(''); setFeedbackColor(''); }, 1000);
        }, 3500);
    };

    // Handler untuk jawaban salah
    const handleIncorrectAnswer = () => {
        playSound('coba-lagi-ya', 'feedback'); // Play specific incorrect feedback sound
        setFeedback('Coba lagi! Jawabanmu belum tepat. 🤔 Jangan menyerah!');
        setFeedbackColor('red');
        setIsExploding(false);
    };

    // Handler saat pengguna menekan tombol "Periksa"
    const handleSubmit = () => {
        if (!currentQuestion) return;

        const parsedInput = parseInt(userInput.trim());
        if (isNaN(parsedInput)) {
            setFeedback('Masukkan angka yang benar ya! 🤔');
            setFeedbackColor('red');
            return;
        }

        if (parsedInput === currentQuestion.answer) {
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer();
        }
    };

    // Handler untuk melewati soal
    const handleSkip = () => {
        setIsExploding(false);
        loadNewQuestion();
    };

    // Handler untuk navigasi ke Dashboard
    const handleGoToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className={styles.mathPageContainer}>
            <Header />
            <div className={styles.contentArea}>
                {isExploding && (
                    <div className={styles.confettiContainer}>
                        <ConfettiExplosion
                            force={1.5}
                            duration={7000}
                            particleCount={400}
                            width={3000}
                            height={3000}
                            colors={['#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#9370DB', '#FF69B4', '#ADFF2F', '#FFEA00', '#00BCD4', '#FF6344']}
                        />
                    </div>
                )}

                <h1 className={styles.pageTitle}>Ayo Berhitung! 🔢✨</h1>

                <div className={styles.sectionSelector}>
                    <button
                        onClick={() => setSelectedSection('counting')}
                        className={`${styles.sectionButton} ${selectedSection === 'counting' ? styles.active : ''}`}
                    >
                        Menghitung Objek 🍎
                    </button>
                    <button
                        onClick={() => setSelectedSection('addition')}
                        className={`${styles.sectionButton} ${selectedSection === 'addition' ? styles.active : ''}`}
                    >
                        Penjumlahan ➕
                    </button>
                    <button
                        onClick={() => setSelectedSection('subtraction')}
                        className={`${styles.sectionButton} ${selectedSection === 'subtraction' ? styles.active : ''}`}
                    >
                        Pengurangan ➖
                    </button>
                    <button
                        onClick={() => setSelectedSection('numbersList')}
                        className={`${styles.sectionButton} ${selectedSection === 'numbersList' ? styles.active : ''}`}
                    >
                        Daftar Angka 1-100 💯
                    </button>
                </div>

                <div className={styles.mathCard}>
                    <h2 className={styles.cardTitle}>{mathContent[selectedSection].title}</h2>
                    <p className={styles.instructions}>{mathContent[selectedSection].instructions}</p>

                    {/* Conditional rendering for Math Questions vs. Numbers List */}
                    {selectedSection !== 'numbersList' && currentQuestion && (
                        <>
                            <div className={styles.questionContainer}>
                                {mathContent[selectedSection].showSoundButton && (
                                    <button onClick={() => playSound(currentQuestion.soundText, 'math_question')} className={styles.speakButton}>
                                        <span role="img" aria-label="speaker">🔊</span> Dengar Soal
                                    </button>
                                )}
                                <p className={styles.questionText}>{currentQuestion.question}</p>
                            </div>

                            <input
                                type="number"
                                className={styles.mathInput}
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Tulis jawabanmu di sini..."
                                inputMode="numeric"
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
                        </>
                    )}

                    {selectedSection === 'numbersList' && numbersData.length > 0 && (
                        <div className={styles.numbersGrid}>
                            {numbersData.map((item) => (
                                <button
                                    key={item.number}
                                    className={styles.numberButton}
                                    onClick={() => playSound(item.soundText, 'number')}
                                >
                                    {item.number}
                                    <span className={styles.numberSpeakIcon} role="img" aria-label="speaker">🔊</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleGoToDashboard}
                    className={styles.dashboardButtonMath}
                >
                    <span role="img" aria-label="dashboard">🏠</span> Dashboard Utama
                </button>
            </div>
        </div>
    );
};

export default MathPage;