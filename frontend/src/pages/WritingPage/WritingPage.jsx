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
            'Rachel Cantik',
            'bella nyanyi di rumah budi',
            'bapak joget pakai sarung',
            'rachel makan roti jatuh',
            'kak angel lompat sambil nangis',
            'mamak baca koran terbalik',
            'bou mery takut balon meletus',
            'kakak aulia lari keliling kursi',
            'bapak jatuh dari bangku',
            'bella ketawa sampai nangis',
            'rachel siram bunga kebanyakan air',
            'kak angel joget balon sabun',
            'mamak nyanyi suara cempreng',
            'bou mery makan donat besar',
            'bapak beli bakso pedas banget',
            'kakak aulia main boneka kelinci',
            'rachel tidur sambil ngorok',
            'bella lompat ke kasur empuk',
            'bapak baca buku kebalik',
            'mamak makan mie kepedasan',
            'kak angel baca buku pink',
            'bou mery nyanyi sambil lompat',
            'bella takut boneka panda',
            'kakak aulia joget di teras',
            'rachel ketawa keras banget',
            'bapak lompat sambil pegang sandal',
            'mamak siram bunga pagi',
            'bou mery joget di dapur',
            'kak angel nyanyi nada tinggi',
            'bella baca buku tebal',
            'rachel makan roti coklat',
            'bapak tidur sambil ngorok',
            'kakak aulia lompat jungkir balik',
            'mamak jatuh duduk lucu',
            'bou mery baca buku tipis',
            'kak angel main balon sabun',
            'rachel joget keliling rumah',
            'bella makan donat warna-warni',
            'bapak ketawa sambil pegang perut',
            'kakak aulia siram bunga kuning',
            'mamak beli donat kepedasan',
            'bou mery lompat ke sofa',
            'rachel nyanyi sambil ketawa',
            'kak angel lompat di kasur',
            'bapak makan mie panas banget',
            'bella joget sambil ketawa',
            'mamak lari keliling rumah',
            'kakak aulia baca buku besar',
            'rachel takut kucing gendut',
            'bou mery ketawa jungkir balik',
            'bapak nyanyi suara sumbang',
            'kak angel tidur sambil senyum',
            'bella siram bunga sore',
            'mamak joget balon sabun',
            'kakak aulia lompat sambil ketawa',
            'bapak baca buku tipis',
            'rachel lompat sambil tertawa',
            'bou mery makan mie kebanyakan',
            'kak angel ketawa ngakak keras',
            'bella nyanyi suara cempreng',
            'mamak makan roti isi coklat'
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

    const audioRef = useRef(new Audio()); // Untuk memutar audio pertanyaan (dari getSoundPath atau TTS)
    const clickAudioRef = useRef(null); // Untuk memutar audio klik tombol
    const correctSoundRef = useRef(null); // Untuk memutar audio jawaban benar
    const incorrectSoundRef = useRef(null); // Untuk memutar audio jawaban salah

    const navigate = useNavigate();

    const currentContent = writingContent[selectedSection];
    const currentExample = currentContent.examples[currentExampleIndex];

    // Efek samping untuk inisialisasi suara klik dan suara jawaban
    useEffect(() => {
        if (!clickAudioRef.current) {
            clickAudioRef.current = new Audio('/sound/tombol.mp3'); // Path untuk suara tombol
            clickAudioRef.current.volume = 0.8;
        }
        if (!correctSoundRef.current) {
            correctSoundRef.current = new Audio('/sound/benar.mp3'); // Path untuk suara benar
            correctSoundRef.current.volume = 1.0;
        }
        if (!incorrectSoundRef.current) {
            incorrectSoundRef.current = new Audio('/sound/salah.mp3'); // Path untuk suara salah
            incorrectSoundRef.current.volume = 1.0;
        }
    }, []);

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

    // Efek samping saat bagian (letters, words, sentences) berubah
    useEffect(() => {
        setUserInput('');
        setFeedback('');
        setFeedbackColor('');
        setCurrentExampleIndex(0);
        setIsExploding(false);
        // Memastikan suara diputar saat bagian baru dipilih
        if (currentContent.examples[0]) {
            playSound();
        }
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
            window.speechSynthesis.onvoiceschanged = () => {
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
        playClickSound(); // Play click sound on submit
        const trimmedInput = userInput.trim().toLowerCase();
        const trimmedExample = currentExample.trim().toLowerCase();

        if (trimmedInput === trimmedExample) {
            playCorrectSound(); // Play correct sound
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
                setTimeout(() => {
                    setFeedback('');
                    setFeedbackColor('');
                }, 1000);
            }, 1500);

        } else {
            playIncorrectSound(); // Play incorrect sound
            setFeedback('Coba lagi, ya! Jangan menyerah! Kamu pasti bisa! 💪');
            setFeedbackColor('red');
            setIsExploding(false);
        }
    };

    // Handler untuk melewati soal saat ini
    const handleSkip = () => {
        playClickSound(); // Play click sound on skip
        setIsExploding(false);
        if (currentExampleIndex < currentContent.examples.length - 1) {
            setCurrentExampleIndex(currentExampleIndex + 1);
        } else {
            setCurrentExampleIndex(0);
        }
        setUserInput('');
        setFeedback('');
        setFeedbackColor('');
    };

    // Handler untuk navigasi ke Dashboard
    const handleGoToDashboard = () => {
        playClickSound(); // Play click sound on dashboard button
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
                        onClick={() => { playClickSound(); setSelectedSection('letters'); }}
                        className={`${styles.sectionButton} ${selectedSection === 'letters' ? styles.active : ''}`}
                    >
                        Menulis Huruf
                    </button>
                    <button
                        onClick={() => { playClickSound(); setSelectedSection('words'); }}
                        className={`${styles.sectionButton} ${selectedSection === 'words' ? styles.active : ''}`}
                    >
                        Menulis Kata
                    </button>
                    <button
                        onClick={() => { playClickSound(); setSelectedSection('sentences'); }}
                        className={`${styles.sectionButton} ${selectedSection === 'sentences' ? styles.active : ''}`}
                    >
                        Menulis Kalimat
                    </button>
                </div>

                <div className={styles.writingCard}>
                    <h2 className={styles.cardTitle}>{currentContent.title}</h2>
                    <p className={styles.instructions}>{currentContent.instructions}</p>

                    <div className={styles.exampleContainer}>
                        <button onClick={() => { playClickSound(); playSound(); }} className={styles.speakButton}>
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
