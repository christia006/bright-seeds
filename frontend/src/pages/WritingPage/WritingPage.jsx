import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import styles from './WritingPage.module.css';

// Placeholder untuk ConfettiExplosion jika Anda belum menginstalnya atau ingin mengujinya tanpa library
// Jika Anda sudah menginstal 'react-confetti-explosion', Anda bisa menghapus placeholder ini.
const ConfettiExplosion = ({ force, duration, particleCount, width, height, colors }) => {
    useEffect(() => {
        // Ini adalah komponen dummy. Dalam aplikasi nyata, Anda akan mengimpor library yang sebenarnya.
        if (typeof window !== 'undefined') {
            // console.log("Confetti Explosion would be playing now!");
            // Anda bisa menambahkan visual sederhana di sini untuk demonstrasi
        }
    }, []);
    return null; // Tidak merender apapun yang terlihat
};

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

// Fungsi placeholder untuk mendapatkan path suara.
// Dalam aplikasi nyata, Anda akan memiliki file audio di folder 'public'
// dan mengembalikan path yang sesuai, misalnya: `/sounds/letters/a.mp3`
const getSoundPath = (text, type) => {
    // Contoh: jika Anda memiliki file di public/sounds/letters/a.mp3,
    // Anda bisa mengembalikan `/sounds/${type}s/${text}.mp3`
    // Untuk saat ini, kita akan selalu mengembalikan null agar Web Speech API digunakan.
    return null;
};

const WritingPage = () => {
    const [selectedSection, setSelectedSection] = useState('letters');
    const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('');
    const [isExploding, setIsExploding] = useState(false);

    const audioRef = useRef(new Audio());
    const navigate = useNavigate();

    const currentContent = writingContent[selectedSection];
    const currentExample = currentContent.examples[currentExampleIndex];

    // Efek samping saat bagian (letters, words, sentences) berubah
    useEffect(() => {
        setUserInput('');
        setFeedback('');
        setFeedbackColor('');
        setCurrentExampleIndex(0);
        setIsExploding(false);
    }, [selectedSection]);

    // Efek samping untuk memutar suara saat currentExample berubah
    useEffect(() => {
        // Memastikan suara diputar saat soal baru dimuat
        if (currentExample) {
            playSound();
        }
    }, [currentExample]); // Dependensi: panggil playSound setiap kali currentExample berubah

    // Fungsi untuk memutar suara dari file atau fallback ke Web Speech API
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

    // Fungsi untuk memutar teks menggunakan Web Speech API (Text-to-Speech)
    const playWebSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance(text);
            msg.lang = 'id-ID';
            msg.rate = 0.7;
            msg.pitch = 1.0;

            const voices = window.speechSynthesis.getVoices();
            // Pastikan voices dimuat sebelum mencoba mencari
            voices.onvoiceschanged = () => {
                const indoVoice = voices.find(voice => voice.lang === 'id-ID' && voice.name.includes('Google Bahasa Indonesia'));
                if (indoVoice) {
                    msg.voice = indoVoice;
                }
                window.speechSynthesis.speak(msg);
            };

            // Jika voices sudah dimuat, langsung panggil speak
            if (voices.length > 0) {
                 const indoVoice = voices.find(voice => voice.lang === 'id-ID' && voice.name.includes('Google Bahasa Indonesia'));
                if (indoVoice) {
                    msg.voice = indoVoice;
                }
                window.speechSynthesis.speak(msg);
            }

        } else {
            console.error("Browser Anda tidak mendukung Web Speech API.");
            setFeedback("Maaf, browser Anda tidak mendukung fitur suara.");
            setFeedbackColor("orange");
        }
    };

    // Handler saat pengguna menekan tombol "Periksa"
    const handleSubmit = async () => {
        const trimmedInput = userInput.trim().toLowerCase();
        const trimmedExample = currentExample.trim().toLowerCase();

        if (trimmedInput === trimmedExample) {
            setFeedback('Hebat! Betul sekali! Lanjut ke tantangan berikutnya! ✨');
            setFeedbackColor('green');
            setIsExploding(true);

            setTimeout(() => {
                setIsExploding(false);
                if (currentExampleIndex < currentContent.examples.length - 1) {
                    setCurrentExampleIndex(currentExampleIndex + 1);
                } else {
                    setCurrentExampleIndex(0);
                    setFeedback('Kamu sudah menyelesaikan semua tantangan di bagian ini! Hebat! 🎉');
                    setFeedbackColor('purple');
                }
                setUserInput('');
                // playSound(); // Panggil playSound untuk soal berikutnya
                setTimeout(() => {
                    setFeedback('');
                    setFeedbackColor('');
                }, 1000);
            }, 1500);

        } else {
            setFeedback('Coba lagi, ya! Jangan menyerah! Kamu pasti bisa! 💪');
            setFeedbackColor('red');
            setIsExploding(false);
        }
    };

    // Handler untuk melewati soal saat ini
    const handleSkip = () => {
        setIsExploding(false);
        if (currentExampleIndex < currentContent.examples.length - 1) {
            setCurrentExampleIndex(currentExampleIndex + 1);
        } else {
            setCurrentExampleIndex(0);
        }
        setUserInput('');
        setFeedback('');
        setFeedbackColor('');
        // playSound(); // Panggil playSound untuk soal berikutnya
    };

    // Handler untuk navigasi ke Dashboard
    const handleGoToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className={styles.writingPageContainer}>
            <Header />
            <div className={styles.contentArea}>
                {isExploding && (
                    <div className={styles.confettiContainer}>
                        <ConfettiExplosion
                            force={0.8}
                            duration={3000}
                            particleCount={100}
                            width={1000}
                            height={1000}
                            colors={['#FFC107', '#4CAF50', '#8E24AA', '#FF5722']}
                        />
                    </div>
                )}

                <h1 className={styles.pageTitle}>Ayo Menulis! ✍️</h1>

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
