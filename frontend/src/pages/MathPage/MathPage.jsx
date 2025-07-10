import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header/Header';
// Pastikan path ini benar
import styles from './MathPage.module.css';
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

const mathContent = {
    counting: {
        title: "Menghitung Objek",
        instructions: "Hitung objek-objek lucu ini dan ketikkan jawabannya!",
        generateQuestion: generateCountingQuestion,
        showSoundButton: true, // Tambahkan tombol sound untuk counting agar anak bisa mendengar soalnya
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
};

// Daftar sound efek untuk jawaban benar (pastikan file audio ada di path /sounds/feedback/)
const POSITIVE_FEEDBACK_SOUNDS = [
    'mantap-bos', 'kamu-gila', 'gila-bisa-benar', 'kok-bisa-benar', 'anjay-benar', 'benar-pula',
    'bagus-sekali', 'pintar-banget', 'luar-biasa', 'keren-abis'
];

// Daftar sound efek untuk jawaban salah (pastikan file audio ada di path /sounds/feedback/)
const NEGATIVE_FEEDBACK_SOUNDS = [
    'kasihan-salah', 'salah-gila', 'salah-ya', 'slebew-salah', 'salah-terus', 'udah-jelek-salah-lagi',
    'coba-lagi-ya', 'jangan-menyerah', 'pasti-bisa'
];


const MathPage = () => { // Hapus props currentUser, setCurrentUser
    const [selectedSection, setSelectedSection] = useState('counting');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('');

    // Confetti state
    const [isExploding, setIsExploding] = useState(false);

    const audioRef = useRef(new Audio());
    const navigate = useNavigate(); // Inisialisasi hook useNavigate

    // Effect untuk memuat soal awal saat komponen dimuat atau bagian berubah
    useEffect(() => {
        loadNewQuestion();
    }, [selectedSection]);

    // Fungsi untuk memuat soal baru
    const loadNewQuestion = () => {
        const newQuestion = mathContent[selectedSection].generateQuestion();
        setCurrentQuestion(newQuestion);
        setUserInput('');
        setFeedback('');
        setFeedbackColor('');
        setIsExploding(false); // Pastikan konfeti mati saat memuat soal baru
    };

    // General sound player untuk berbagai jenis (soal, angka, umpan balik)
    const playSound = (textToSpeak, soundType = 'question') => {
        if (!textToSpeak) return;

        let path;
        // getSoundPath harus cukup pintar untuk menangani berbagai jenis suara
        // Asumsi getSoundPath akan mengembalikan path yang benar berdasarkan textToSpeak dan soundType
        if (soundType === 'positive-feedback' || soundType === 'negative-feedback') {
            path = getSoundPath(textToSpeak, 'feedback'); // textToSpeak adalah nama file audio di sini
        } else if (soundType === 'number') {
            path = getSoundPath(textToSpeak, 'number');
        } else {
            path = getSoundPath(textToSpeak, 'math_question'); // Untuk soal matematika
        }

        if (path) {
            audioRef.current.src = path;
            audioRef.current.play().catch(e => {
                console.warn(`Error playing sound from file (${path}), falling back to Web Speech API:`, e);
                // Fallback ke Web Speech API hanya untuk suara soal/angka, bukan untuk umpan balik
                if (soundType !== 'positive-feedback' && soundType !== 'negative-feedback') {
                    playWebSpeech(textToSpeak);
                }
            });
        } else {
            console.warn(`No specific sound file found for "${textToSpeak}" (type: ${soundType}), falling back to Web Speech API.`);
            if (soundType !== 'positive-feedback' && soundType !== 'negative-feedback') {
                playWebSpeech(textToSpeak);
            }
        }
    };

    // Fallback ke Web Speech API (Text-to-Speech)
    const playWebSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance(text);
            msg.lang = 'id-ID';
            msg.rate = 0.7; // Kecepatan bicara lebih lambat untuk anak-anak
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
        const randomPositiveSound = POSITIVE_FEEDBACK_SOUNDS[getRandomNumber(0, POSITIVE_FEEDBACK_SOUNDS.length - 1)];
        playSound(randomPositiveSound, 'positive-feedback'); // Putar suara umpan balik positif
        setFeedback('Hebat! Jawabanmu benar! 🎉 Lanjut ke soal berikutnya!');
        setFeedbackColor('green');
        setIsExploding(true); // Aktifkan konfeti

        // Otomatis memuat soal berikutnya setelah jeda singkat
        setTimeout(() => {
            setIsExploding(false); // Matikan konfeti
            loadNewQuestion(); // Muat soal baru
            setTimeout(() => { setFeedback(''); setFeedbackColor(''); }, 1000); // Bersihkan umpan balik
        }, 3500); // Jeda yang cukup untuk animasi konfeti dan pesan
    };

    // Handler untuk jawaban salah
    const handleIncorrectAnswer = () => {
        const randomNegativeSound = NEGATIVE_FEEDBACK_SOUNDS[getRandomNumber(0, NEGATIVE_FEEDBACK_SOUNDS.length - 1)];
        playSound(randomNegativeSound, 'negative-feedback'); // Putar suara umpan balik negatif
        setFeedback('Coba lagi! Jawabanmu belum tepat. 🤔 Jangan menyerah!');
        setFeedbackColor('red');
        setIsExploding(false); // Pastikan konfeti mati
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
        setIsExploding(false); // Matikan konfeti jika melewati
        loadNewQuestion(); // Muat soal baru
    };

    // Handler untuk navigasi ke Dashboard
    const handleGoToDashboard = () => {
        navigate('/dashboard'); // Navigasi ke halaman Dashboard
    };

    return (
        <div className={styles.mathPageContainer}>
            <Header />
            <div className={styles.contentArea}>
                {/* Konfeti akan muncul di sini */}
                {isExploding && (
                    <div className={styles.confettiContainer}>
                        <ConfettiExplosion
                            force={1.5} // Kekuatan ledakan lebih tinggi
                            duration={7000} // Durasi konfeti lebih lama
                            particleCount={400} // Lebih banyak partikel
                            width={3000} // Area sebaran lebih luas
                            height={3000} // Area sebaran lebih tinggi
                            colors={['#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#9370DB', '#FF69B4', '#ADFF2F', '#FFEA00', '#00BCD4', '#FF6344']} // Warna-warna cerah dan beragam
                        />
                    </div>
                )}

                <h1 className={styles.pageTitle}>Ayo Berhitung! 🔢✨</h1>

                {/* Level indicator dihapus sesuai permintaan */}

                {/* Bagian pemilih kategori (Menghitung Objek, Penjumlahan, Pengurangan) */}
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
                </div>

                {/* Kartu utama untuk aktivitas matematika */}
                <div className={styles.mathCard}>
                    <h2 className={styles.cardTitle}>{mathContent[selectedSection].title}</h2>
                    <p className={styles.instructions}>{mathContent[selectedSection].instructions}</p>

                    {currentQuestion && (
                        <div className={styles.questionContainer}>
                            {/* Tampilkan tombol sound jika showSoundButton adalah true */}
                            {mathContent[selectedSection].showSoundButton && (
                                <button onClick={() => playSound(currentQuestion.soundText, 'math_question')} className={styles.speakButton}>
                                    <span role="img" aria-label="speaker">🔊</span> Dengar Soal
                                </button>
                            )}
                            <p className={styles.questionText}>{currentQuestion.question}</p>
                        </div>
                    )}

                    {/* Area input angka */}
                    <input
                        type="number"
                        className={styles.mathInput}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Tulis jawabanmu di sini..."
                        inputMode="numeric" // Keyboard numerik di perangkat sentuh
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
                    className={styles.dashboardButtonMath}
                >
                    <span role="img" aria-label="dashboard">🏠</span> Dashboard Utama
                </button>
            </div>
        </div>
    );
};

export default MathPage;
