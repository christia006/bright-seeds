import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header/Header';
import { updateUserProgess } from '../../services/userService';
import { getSoundPath } from '../../utils/soundHelper'; // Pastikan path benar
import styles from './MathPage.module.css';
import ConfettiExplosion from 'react-confetti-explosion'; // Import Confetti

// Helper function to generate random number
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate math questions
const generateCountingQuestion = () => {
    const count = getRandomNumber(1, 20); // Count objects up to 20
    const objectType = ['apel', 'bintang', 'bola', 'bunga', 'ikan'][getRandomNumber(0, 4)];
    const objects = Array(count).fill(objectType);
    return {
        question: `Ada berapa ${objectType} ini? ${objects.map(obj => ` ${obj === 'apel' ? '🍎' : obj === 'bintang' ? '⭐' : obj === 'bola' ? '⚽' : obj === 'bunga' ? '🌸' : '🐠'}`).join('')}`,
        answer: count,
        soundText: String(count), // Sound will be the number (optional, not used by default for counting)
        type: 'counting'
    };
};

const generateAdditionQuestion = () => {
    const num1 = getRandomNumber(1, 10);
    const num2 = getRandomNumber(1, 10);
    return {
        question: `${num1} + ${num2} = ?`,
        answer: num1 + num2,
        soundText: `${num1} tambah ${num2} sama dengan berapa`, // Text for speech
        type: 'addition'
    };
};

const generateSubtractionQuestion = () => {
    let num1 = getRandomNumber(5, 15);
    let num2 = getRandomNumber(1, num1 - 1); // Ensure result is positive
    return {
        question: `${num1} - ${num2} = ?`,
        answer: num1 - num2,
        soundText: `${num1} kurang ${num2} sama dengan berapa`, // Text for speech
        type: 'subtraction'
    };
};

const mathContent = {
    counting: {
        title: "Menghitung Objek",
        instructions: "Hitung objek-objek ini dan ketikkan jawabannya.",
        generateQuestion: generateCountingQuestion,
        levelThreshold: 5, // Items to complete per level for progression within a section
        showSoundButton: false, // Menghilangkan tombol sound untuk counting
    },
    addition: {
        title: "Penjumlahan",
        instructions: "Dengarkan soal penjumlahan, lalu ketikkan jawabannya.",
        generateQuestion: generateAdditionQuestion,
        levelThreshold: 5,
        showSoundButton: true,
    },
    subtraction: {
        title: "Pengurangan",
        instructions: "Dengarkan soal pengurangan, lalu ketikkan jawabannya.",
        generateQuestion: generateSubtractionQuestion,
        levelThreshold: 5,
        showSoundButton: true,
    },
};

const MAX_LEVEL = 20;

// Daftar sound efek untuk jawaban benar
const POSITIVE_FEEDBACK_SOUNDS = [
    'mantap-bos',
    'kamu-gila',
    'gila-bisa-benar',
    'kok-bisa-benar',
    'anjay-benar',
    'benar-pula'
];

// Daftar sound efek untuk jawaban salah
const NEGATIVE_FEEDBACK_SOUNDS = [
    'kasihan-salah',
    'salah-gila',
    'salah-ya',
    'slebew-salah',
    'salah-terus',
    'udah-jelek-salah-lagi'
];


const MathPage = ({ currentUser, setCurrentUser }) => {
    const [selectedSection, setSelectedSection] = useState('counting');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('');
    const [level, setLevel] = useState(currentUser?.progress?.math?.level || 1);
    const [completedQuestionsCount, setCompletedQuestionsCount] = useState(0); // Initialize with 0

    // Confetti state
    const [isExploding, setIsExploding] = useState(false);

    const audioRef = useRef(new Audio());

    const loadNewQuestion = () => {
        const newQuestion = mathContent[selectedSection].generateQuestion();
        setCurrentQuestion(newQuestion);
        setUserInput('');
        setFeedback('');
        setFeedbackColor('');
        setIsExploding(false); // Ensure confetti is off when loading a new question
    };

    // Effect to load initial question and update completed count when section changes or user data loads
    useEffect(() => {
        loadNewQuestion();
        // Update completedQuestionsCount based on selectedSection and currentUser progress
        const currentProgress = currentUser?.progress?.math?.[selectedSection] || [];
        setCompletedQuestionsCount(currentProgress.length);
    }, [selectedSection, currentUser]); // Depend on selectedSection and currentUser

    // General sound player for various types (question, number, feedback)
    const playSound = (textToSpeak, soundType = 'question') => { // Default to 'question' if not specified
        if (!textToSpeak) return;

        let path;
        // The getSoundPath function should be smart enough to handle different types
        // Ensure your soundHelper.js supports 'feedback', 'number', 'math_question' types
        if (soundType === 'positive-feedback' || soundType === 'negative-feedback') {
            path = getSoundPath(textToSpeak, 'feedback'); // 'textToSpeak' is the filename here
        } else if (soundType === 'counting') {
            // For counting, if we want to read the number (e.g., "5")
            path = getSoundPath(textToSpeak, 'number');
        } else {
            // For math questions (e.g., "5 tambah 3 sama dengan berapa")
            path = getSoundPath(textToSpeak, 'math_question');
        }

        if (path) {
            audioRef.current.src = path;
            audioRef.current.play().catch(e => {
                console.warn(`Error playing sound from file (${path}), falling back to Web Speech API:`, e);
                // Fallback to Web Speech API only for question/number sounds, not for feedback sounds
                if (soundType !== 'positive-feedback' && soundType !== 'negative-feedback') {
                    playWebSpeech(textToSpeak);
                }
            });
        } else {
            console.warn(`No specific sound file found for "${textToSpeak}" (type: ${soundType}), falling back to Web Speech API.`);
            // Fallback to Web Speech API if no specific sound file is found
            if (soundType !== 'positive-feedback' && soundType !== 'negative-feedback') {
                playWebSpeech(textToSpeak);
            }
        }
    };

    // Fallback to Web Speech API
    const playWebSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance(text);
            msg.lang = 'id-ID';
            msg.rate = 0.7; // Slower speech for kids
            msg.pitch = 1.0;

            const voices = window.speechSynthesis.getVoices();
            // Try to find a specific Indonesian voice
            const indoVoice = voices.find(voice => voice.lang === 'id-ID' && (voice.name.includes('Google Bahasa Indonesia') || voice.name.includes('ID')));
            if (indoVoice) {
                msg.voice = indoVoice;
            } else {
                console.warn("No specific Indonesian voice found, using default browser voice.");
            }

            window.speechSynthesis.speak(msg);
        } else {
            alert("Browser Anda tidak mendukung Web Speech API.");
        }
    };

    const handleCorrectAnswer = async () => {
        const randomPositiveSound = POSITIVE_FEEDBACK_SOUNDS[getRandomNumber(0, POSITIVE_FEEDBACK_SOUNDS.length - 1)];
        playSound(randomPositiveSound, 'positive-feedback'); // Play random positive sound
        setFeedback('Hebat! Jawabanmu benar! 🎉');
        setFeedbackColor('green');
        setIsExploding(true); // Trigger confetti

        try {
            const currentSectionProgress = currentUser.progress?.math?.[selectedSection] || [];
            // Generate a unique ID for the question to prevent duplicates
            const questionId = `${selectedSection}-${currentQuestion.question}-${currentQuestion.answer}`;
            
            const newCompleted = [...currentSectionProgress, questionId];
            const uniqueCompleted = Array.from(new Set(newCompleted)); // Ensure unique entries

            setCompletedQuestionsCount(uniqueCompleted.length);

            let newLevel = level;
            const threshold = mathContent[selectedSection].levelThreshold;
            
            // Calculate level based on unique completed questions for the current section
            // Level 1 is the base, so (uniqueCompleted.length / threshold) gives how many thresholds are met.
            // Add 1 to start from level 1, and cap at MAX_LEVEL.
            const calculatedLevel = Math.min(MAX_LEVEL, Math.floor(uniqueCompleted.length / threshold) + 1);

            if (calculatedLevel > level) {
                newLevel = calculatedLevel;
                setFeedback(`Selamat! Kamu naik ke Level ${newLevel}! 🚀`);
                setFeedbackColor('purple');
            } else if (uniqueCompleted.length >= (selectedSection === 'counting' ? 100 : 50) && level < MAX_LEVEL) {
                // This condition provides an alternative way to level up if many questions are completed
                // but perhaps not enough to hit the "threshold" for the current section.
                // Adjust numbers (100, 50) as needed.
                newLevel = Math.min(MAX_LEVEL, level + 1);
                setFeedback(`Luar biasa! Kamu menyelesaikan banyak soal dan naik ke Level ${newLevel}! 🏆`);
                setFeedbackColor('blue');
            } else if (level === MAX_LEVEL) {
                setFeedback('Luar biasa! Kamu telah menyelesaikan semua di Level Maksimal! ✨');
                setFeedbackColor('gold');
            }


            const updatedUser = await updateUserProgess(currentUser.username, {
                math: {
                    ...currentUser.progress?.math,
                    [selectedSection]: uniqueCompleted,
                    level: newLevel, // Update overall math level
                }
            });
            setCurrentUser(updatedUser);
            setLevel(newLevel); // Update local level state

            setTimeout(() => {
                setIsExploding(false); // Stop confetti
                loadNewQuestion(); // Load next question
                // Clear feedback after a short delay so user can read it first
                setTimeout(() => { setFeedback(''); setFeedbackColor(''); }, 1000); 
            }, 3500); // Increased delay to let confetti animation finish nicely

        } catch (error) {
            console.error("Error updating user progress:", error);
            setFeedback('Gagal menyimpan progres: ' + error.message);
            setFeedbackColor('red');
            setTimeout(() => { setFeedback(''); setFeedbackColor(''); }, 3000);
        }
    };

    const handleIncorrectAnswer = () => {
        const randomNegativeSound = NEGATIVE_FEEDBACK_SOUNDS[getRandomNumber(0, NEGATIVE_FEEDBACK_SOUNDS.length - 1)];
        playSound(randomNegativeSound, 'negative-feedback'); // Play random negative sound
        setFeedback('Coba lagi! Jawabanmu belum tepat. 🤔');
        setFeedbackColor('red');
        setIsExploding(false); // Ensure confetti is off
    };


    const handleSubmit = async () => {
        if (!currentQuestion) return;

        const parsedInput = parseInt(userInput.trim());
        if (isNaN(parsedInput)) {
            setFeedback('Masukkan angka yang benar! 🤔');
            setFeedbackColor('red');
            return;
        }

        if (parsedInput === currentQuestion.answer) {
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer();
        }
    };

    const handleSkip = () => {
        setIsExploding(false); // Turn off confetti if skipping
        loadNewQuestion();
    };

    return (
        <div className={styles.mathPageContainer}>
            <Header />
            <div className={styles.contentArea}>
                {isExploding && (
                    <div className={styles.confettiContainer}>
                        <ConfettiExplosion
                            force={1.2} // Slightly increased force for a more dynamic burst
                            duration={6000} // Longer duration for confetti to fall slowly
                            particleCount={300} // More particles for a fuller effect
                            width={2500} // Wider spread
                            height={2500} // Taller spread
                            colors={['#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#9370DB', '#FF69B4', '#ADFF2F', '#FFEA00', '#00BCD4', '#FF6347']} // More vibrant colors
                        />
                    </div>
                )}

                <h1 className={styles.pageTitle}>Ayo Berhitung! ➕➖✖️➗</h1>

                <div className={styles.levelIndicator}>
                    Level Berhitung: <span className={styles.levelNumber}>{level}</span>
                </div>

                <div className={styles.sectionSelector}>
                    <button
                        onClick={() => setSelectedSection('counting')}
                        className={`${styles.sectionButton} ${selectedSection === 'counting' ? styles.active : ''}`}
                    >
                        Menghitung Objek
                    </button>
                    <button
                        onClick={() => setSelectedSection('addition')}
                        className={`${styles.sectionButton} ${selectedSection === 'addition' ? styles.active : ''}`}
                    >
                        Penjumlahan
                    </button>
                    <button
                        onClick={() => setSelectedSection('subtraction')}
                        className={`${styles.sectionButton} ${selectedSection === 'subtraction' ? styles.active : ''}`}
                    >
                        Pengurangan
                    </button>
                </div>

                <div className={styles.mathCard}>
                    <h2 className={styles.cardTitle}>{mathContent[selectedSection].title}</h2>
                    <p className={styles.instructions}>{mathContent[selectedSection].instructions}</p>

                    {currentQuestion && (
                        <div className={styles.questionContainer}>
                            {/* Hanya tampilkan tombol sound jika showSoundButton adalah true */}
                            {mathContent[selectedSection].showSoundButton && (
                                <button onClick={() => playSound(currentQuestion.soundText, 'math_question')} className={styles.speakButton}>
                                    <span role="img" aria-label="speaker">🔊</span> Dengar Soal
                                </button>
                            )}
                            <p className={styles.questionText}>{currentQuestion.question}</p>
                        </div>
                    )}

                    <input
                        type="number"
                        className={styles.mathInput}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Tulis jawabanmu di sini..."
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

export default MathPage;