import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header'; // Sesuaikan path
import { updateUserProgess } from '../../services/userService';
import styles from './GamesPage.module.css'; // Import CSS Module
import ConfettiExplosion from 'react-confetti-explosion'; // Import Confetti

const GamesPage = ({ currentUser, setCurrentUser }) => {
    const [subGame, setSubGame] = useState(null); // State untuk mengontrol game mana yang aktif
    const [message, setMessage] = useState(''); // Pesan umum untuk user
    const [messageColor, setMessageColor] = useState('black'); // Warna pesan umum

    // --- State & Logic untuk Pattern Scanner ---
    // Tambahkan lebih banyak emoji untuk variasi
    const PS_EMOJIS = ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠', '🟤', '⚪', '⬛', '⬜', '🟦', '🟨', '🟥', '🟩'];
    const PS_PATTERN_LENGTHS = [3, 4, 5]; // Panjang pola yang lebih bervariasi
    const PS_SEQUENCE_DISPLAY_LENGTH_BASE = 5; // Panjang dasar sequence
    const PS_MAX_LEVEL = 30; // Maksimum level untuk game ini

    const [psCurrentPattern, setPsCurrentPattern] = useState([]);
    const [psQuestionSequence, setPsQuestionSequence] = useState([]);
    const [psCorrectAnswerEmoji, setPsCorrectAnswerEmoji] = useState('');
    const [psUserInput, setPsUserInput] = useState('');
    const [psFeedback, setPsFeedback] = useState('');
    const [psFeedbackColor, setPsFeedbackColor] = useState('');
    const [psScore, setPsScore] = useState(0);
    const [psLevel, setPsLevel] = useState(1); // Mulai dari level 1
    const [psIsExploding, setPsIsExploding] = useState(false);

    useEffect(() => {
        if (subGame === 'patternScanner') {
            generatePsNewQuestion();
        }
    }, [psLevel, subGame]);

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const getEmojiName = (emoji) => {
        const emojiMap = {
            '🔴': 'merah', '🔵': 'biru', '🟡': 'kuning', '🟢': 'hijau',
            '🟣': 'ungu', '🟠': 'oranye', '🟤': 'cokelat', '⚪': 'putih',
            '⬛': 'hitam', '⬜': 'putih', '🟦': 'biru gelap', '🟨': 'kuning cerah',
            '🟥': 'merah terang', '🟩': 'hijau terang'
        };
        return emojiMap[emoji] || 'warna ini';
    };

    const generatePsNewQuestion = () => {
        // Tingkatkan panjang sequence seiring level
        const currentSequenceLength = PS_SEQUENCE_DISPLAY_LENGTH_BASE + Math.floor((psLevel - 1) / 5); // +1 setiap 5 level
        const currentPatternLengthOptions = PS_PATTERN_LENGTHS.filter(len => len <= Math.min(5, 3 + Math.floor((psLevel - 1) / 10))); // Pola makin panjang di level tinggi

        const patternLength = getRandomElement(currentPatternLengthOptions.length > 0 ? currentPatternLengthOptions : [3]);
        const newPattern = Array.from({ length: patternLength }, () => getRandomElement(PS_EMOJIS));

        const fullSequence = [];
        for (let i = 0; i < currentSequenceLength + 2; i++) {
            fullSequence.push(newPattern[i % patternLength]);
        }

        const qSequence = fullSequence.slice(0, currentSequenceLength);
        const answerEmoji = fullSequence[currentSequenceLength];

        setPsCurrentPattern(newPattern);
        setPsQuestionSequence(qSequence);
        setPsCorrectAnswerEmoji(answerEmoji);
        setPsUserInput('');
        setPsFeedback('');
        setPsFeedbackColor('');
        setPsIsExploding(false);
    };

    const handlePsSubmit = () => {
        if (!psUserInput.trim()) {
            setPsFeedback('Tulis jawabanmu dulu ya! 🤔');
            setPsFeedbackColor('orange');
            return;
        }

        const guessedEmoji = PS_EMOJIS.find(emoji => getEmojiName(emoji) === psUserInput.toLowerCase());

        if (guessedEmoji === psCorrectAnswerEmoji) {
            setPsFeedback('Hebat! Jawabanmu benar! 🎉');
            setPsFeedbackColor('green');
            setPsScore(prev => prev + 10);
            setPsIsExploding(true);

            if (psLevel < PS_MAX_LEVEL) { // Hanya naik level jika belum max level
                if ((psScore + 10) % 30 === 0) { // Naik level lebih sering, setiap 3 jawaban benar
                    setPsLevel(prev => prev + 1);
                    setPsFeedback(`Luar biasa! Kamu naik ke Level ${psLevel + 1}! 🚀`);
                    setPsFeedbackColor('purple');
                }
            } else {
                setPsFeedback(`Luar biasa! Kamu sudah menyelesaikan semua Level di Pattern Scanner! 🎉`);
                setPsFeedbackColor('purple');
            }

            setTimeout(() => {
                setPsIsExploding(false);
                if (psLevel < PS_MAX_LEVEL) {
                    generatePsNewQuestion();
                }
            }, 2500);
        } else {
            setPsFeedback(`Aduh, salah. Jawaban yang benar adalah ${getEmojiName(psCorrectAnswerEmoji)} ${psCorrectAnswerEmoji}. Coba lagi! 🤔`);
            setPsFeedbackColor('red');
            setPsScore(prev => Math.max(0, prev - 5));
        }
    };

    // --- State & Logic untuk Memory Trainer ---
    const MT_EMOJIS = ['🍎', '⚽', '🌟', '🌸', '🐠', '🚗', '🚀', '🌈', '🚲', '🎈', '🎁', '💡', '🎵', '🍪']; // Lebih banyak emoji
    const MT_SEQUENCE_LENGTH_BASE = 3; // Panjang dasar sequence
    const MT_MAX_LEVEL = 30;

    const [mtGamePhase, setMtGamePhase] = useState('memorize');
    const [mtCurrentSequence, setMtCurrentSequence] = useState([]);
    const [mtUserRecall, setMtUserRecall] = useState([]);
    const [mtLevel, setMtLevel] = useState(1);
    const [mtScore, setMtScore] = useState(0);
    const [mtFeedback, setMtFeedback] = useState('');
    const [mtFeedbackColor, setMtFeedbackColor] = useState('');
    const [mtIsExploding, setMtIsExploding] = useState(false); // Tambahkan untuk confetti

    useEffect(() => {
        if (subGame === 'memoryTrainer') {
            generateMtNewSequence();
        }
    }, [mtLevel, subGame]);

    const generateMtNewSequence = () => {
        // Panjang sequence meningkat seiring level
        const length = Math.min(MT_EMOJIS.length, MT_SEQUENCE_LENGTH_BASE + Math.floor((mtLevel - 1) / 3)); // +1 setiap 3 level
        const newSeq = Array.from({ length }, () => getRandomElement(MT_EMOJIS));

        setMtCurrentSequence(newSeq);
        setMtUserRecall([]);
        setMtGamePhase('memorize');
        setMtFeedback('Ingat urutan ini baik-baik!');
        setMtFeedbackColor('blue');
        setMtIsExploding(false);

        // Durasi tampilan sequence lebih pendek di level tinggi
        const displayDuration = Math.max(1500, 3000 - (mtLevel * 100)); // Minimal 1.5 detik
        setTimeout(() => {
            setMtGamePhase('recall');
            setMtFeedback('Sekarang, coba urutkan kembali!');
            setMtFeedbackColor('black');
        }, displayDuration + (length * 300));
    };

    const handleMtEmojiClick = (emoji) => {
        if (mtGamePhase === 'recall') {
            setMtUserRecall(prev => [...prev, emoji]);
            // Optional: Berikan feedback instan jika pilihan pertama salah (tidak disarankan untuk memori)
        }
    };

    const checkMtAnswer = () => {
        if (mtUserRecall.length !== mtCurrentSequence.length) {
            setMtFeedback('Urutanmu belum lengkap! 🤔');
            setMtFeedbackColor('orange');
            return;
        }

        const isCorrect = mtUserRecall.every((emoji, index) => emoji === mtCurrentSequence[index]);

        if (isCorrect) {
            setMtFeedback('Luar biasa! Ingatanmu hebat! 🎉');
            setMtFeedbackColor('green');
            setMtScore(prev => prev + (mtLevel * 20));
            setMtIsExploding(true);

            if (mtLevel < MT_MAX_LEVEL) {
                setMtLevel(prev => prev + 1);
                // Optional: setMtFeedback(`Luar biasa! Kamu naik ke Level ${mtLevel + 1}! 🚀`);
            } else {
                setMtFeedback(`Hebat! Kamu sudah menyelesaikan semua Level di Memory Trainer! 🎉`);
                setMtFeedbackColor('purple');
            }
            setTimeout(() => {
                setMtIsExploding(false);
                if (mtLevel < MT_MAX_LEVEL) {
                    generateMtNewSequence();
                }
            }, 2500);
        } else {
            setMtFeedback(`Aduh, salah. Urutan yang benar adalah: ${mtCurrentSequence.join(' ')}. Coba lagi! 🤔`);
            setMtFeedbackColor('red');
            setMtScore(prev => Math.max(0, prev - 10));
            setTimeout(() => {
                setMtFeedback('Coba lagi!');
                setMtFeedbackColor('black');
                setMtUserRecall([]); // Bersihkan recall untuk coba lagi
            }, 2000);
        }
    };

    // --- State & Logic untuk Puzzle Syarat Ganda ---
    const PSG_MAX_LEVEL = 30; // Maksimum level untuk game ini

    const PSG_PUZZLES = [
        // Level 1-5: 3 posisi, 2 syarat, sangat sederhana
        { id: 1, level: 1, question: "Kucing 🐈 harus di tengah. Anjing 🐕 tidak boleh di samping Burung 🐦.", options: ["🐈", "🐕", "🐦"], slots: 3, answer: "🐕🐈🐦" },
        { id: 2, level: 2, question: "Apel 🍎 di paling kiri. Pisang 🍌 di samping Jeruk 🍊.", options: ["🍎", "🍌", "🍊"], slots: 3, answer: "🍎🍊🍌" },
        { id: 3, level: 3, question: "Buku 📚 di tengah. Pensil ✏️ di ujung kanan.", options: ["📚", "✏️", "✂️"], slots: 3, answer: "✂️📚✏️" },
        { id: 4, level: 4, question: "Mobil 🚗 di paling kanan. Sepeda 🚲 bukan di samping Motor 🏍️.", options: ["🚗", "🚲", "🏍️"], slots: 3, answer: "🚲🏍️🚗" },
        { id: 5, level: 5, question: "Bunga 🌸 di ujung kiri. Kupu-kupu 🦋 di samping Lebah 🐝.", options: ["🌸", "🦋", "🐝"], slots: 3, answer: "🌸🐝🦋" },

        // Level 6-15: 4 posisi, 2-3 syarat, sedikit lebih kompleks
        { id: 6, level: 6, question: "Merah 🔴 di ujung kiri. Biru 🔵 bukan di samping Kuning 🟡. Hijau 🟢 di ujung kanan.", options: ["🔴", "🔵", "🟡", "🟢"], slots: 4, answer: "🔴🟡🔵🟢" },
        { id: 7, level: 7, question: "Sapi 🐄 di samping Ayam 🐔. Bebek 🦆 di paling kiri. Kuda 🐎 bukan di samping Bebek.", options: ["🐄", "🐔", "🦆", "🐎"], slots: 4, answer: "🦆🐄🐔🐎" },
        { id: 8, level: 8, question: "Bintang 🌟 di tengah. Bulan 🌙 di ujung kanan. Matahari ☀️ di samping Bintang.", options: ["🌟", "🌙", "☀️", "☁️"], slots: 4, answer: "☁️☀️🌟🌙" },
        { id: 9, level: 9, question: "Bola ⚽ di ujung kiri. Raket 🎾 di samping Kok 🏸. Gawang 🥅 di ujung kanan.", options: ["⚽", "🎾", "🏸", "🥅"], slots: 4, answer: "⚽🎾🏸🥅" },
        { id: 10, level: 10, question: "Es Krim 🍦 di samping Kue 🍰. Donat 🍩 di ujung kiri. Cokelat 🍫 bukan di samping Kue.", options: ["🍦", "🍰", "🍩", "🍫"], slots: 4, answer: "🍩🍫🍦🍰" },

        // Level 11-20: 5 posisi, 3-4 syarat, mulai lebih menantang
        { id: 11, level: 11, question: "Pohon 🌳 di paling kiri. Bunga 🌸 di samping Rumput 🌱. Batu 🪨 bukan di samping Pohon.", options: ["🌳", "🌸", "🌱", "🪨", "💧"], slots: 5, answer: "🌳💧🌸🌱🪨" },
        { id: 12, level: 12, question: "Payung ☔ di ujung kanan. Jaket 🧥 di samping Topi 🧢. Sepatu 👟 di tengah.", options: ["☔", "🧥", "🧢", "👟", "🧤"], slots: 5, answer: "🧥🧢👟🧤☔" },
        { id: 13, level: 13, question: "Burung Hantu 🦉 di tengah. Serigala 🐺 di ujung kiri. Beruang 🐻 di samping Rusa 🦌.", options: ["🦉", "🐺", "🐻", "🦌", "🦊"], slots: 5, answer: "🐺🦊🐻🦉🦌" },
        { id: 14, level: 14, question: "Pensil ✏️ di paling kiri. Penghapus  eraser di samping Penggaris 📏. Buku Tulis 📓 di ujung kanan.", options: ["✏️", "eraser", "📏", "📓", "🖇️"], slots: 5, answer: "✏️eraser📏🖇️📓" },
        { id: 15, level: 15, question: "Gitar 🎸 di tengah. Piano 🎹 di ujung kiri. Drum 🥁 di samping Mikrofon 🎤.", options: ["🎸", "🎹", "🥁", "🎤", "🎵"], slots: 5, answer: "🎹🎵🎤🎸🥁" },

        // Level 16-30: 5-6 posisi, 4-5 syarat, paling menantang
        { id: 16, level: 16, question: "Mangga 🥭 di paling kiri. Pisang 🍌 di samping Apel 🍎. Nanas 🍍 di ujung kanan. Jeruk 🍊 bukan di samping Mangga.", options: ["🥭", "🍌", "🍎", "🍍", "🍊"], slots: 5, answer: "🥭🍊🍌🍎🍍" },
        { id: 17, level: 17, question: "Kapal 🚢 di ujung kanan. Perahu 🛶 di samping Pelampung 🛟. Layar ⛵ di tengah.", options: ["🚢", "🛶", "🛟", "⛵", "⚓"], slots: 5, answer: "⚓🛶🛟⛵🚢" },
        { id: 18, level: 18, question: "Pizza 🍕 di paling kiri. Burger 🍔 di samping Kentang Goreng 🍟. Hotdog 🌭 di ujung kanan. Taco 🌮 bukan di samping Burger.", options: ["🍕", "🍔", "🍟", "🌭", "🌮"], slots: 5, answer: "🍕🌮🍔🍟🌭" },
        { id: 19, level: 19, question: "Sepatu Roda 🛼 di tengah. Helm ⛑️ di ujung kiri. Bantalan Lutut 🛡️ di samping Sepatu Roda.", options: ["🛼", "⛑️", "🛡️", "🛹", "👟"], slots: 5, answer: "⛑️👟🛡️🛼🛹" },
        { id: 20, level: 20, question: "Kamera 📸 di paling kiri. Foto 🖼️ di samping Video 🎞️. Lampu 💡 di ujung kanan. Tripod  tripod bukan di samping Kamera.", options: ["📸", "🖼️", "🎞️", "💡", "tripod"], slots: 5, answer: "📸tripod🖼️🎞️💡" },

        { id: 21, level: 21, question: "Merah 🔴 di paling kiri. Biru 🔵 bukan di samping Hijau 🟢. Kuning 🟡 di samping Ungu 🟣. Oranye 🟠 di ujung kanan.", options: ["🔴", "🔵", "🟡", "🟢", "🟣", "🟠"], slots: 6, answer: "🔴🟢🟡🟣🔵🟠" },
        { id: 22, level: 22, question: "Angka 1️⃣ di tengah. Angka 2️⃣ di ujung kiri. Angka 3️⃣ di samping Angka 4️⃣. Angka 5️⃣ di ujung kanan.", options: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"], slots: 6, answer: "2️⃣6️⃣3️⃣1️⃣4️⃣5️⃣" },
        { id: 23, level: 23, question: "Senyum 😊 di paling kiri. Sedih 😔 di samping Marah 😡. Terkejut 😲 di tengah. Bingung 😕 bukan di samping Sedih.", options: ["😊", "😔", "😡", "😲", "😕", "🥰"], slots: 6, answer: "😊🥰😔😲😡😕" },
        { id: 24, level: 24, question: "Pulpen 🖊️ di ujung kanan. Kertas 📄 di samping Spidol 🖍️. Buku 📖 di paling kiri. Penghapus eraser bukan di samping Kertas.", options: ["🖊️", "📄", "🖍️", "📖", "eraser", "📎"], slots: 6, answer: "📖📎eraser📄🖍️🖊️" },
        { id: 25, level: 25, question: "Gajah 🐘 di ujung kiri. Jerapah 🦒 di samping Zebra 🦓. Singa 🦁 di tengah. Harimau 🐅 bukan di samping Jerapah.", options: ["🐘", "🦒", "🦓", "🦁", "🐅", "🐒"], slots: 6, answer: "🐘🐒🦒🦓🦁🐅" },

        { id: 26, level: 26, question: "Musim Semi 🌷 di tengah. Musim Panas ☀️ di ujung kiri. Musim Gugur 🍂 di samping Musim Dingin ❄️. Hujan 🌧️ di ujung kanan.", options: ["🌷", "☀️", "🍂", "❄️", "🌧️", "🌈"], slots: 6, answer: "☀️🌈🌷🍂❄️🌧️" },
        { id: 27, level: 27, question: "Bulan 🌙 di ujung kanan. Bintang ⭐ di samping Awan ☁️. Matahari ☀️ di paling kiri. Petir ⚡ bukan di samping Bintang.", options: ["🌙", "⭐", "☁️", "☀️", "⚡", "🌈"], slots: 6, answer: "☀️🌈⭐☁️⚡🌙" },
        { id: 28, level: 28, question: "Raja 👑 di tengah. Ratu 👸 di samping Pangeran 🤴. Putri 👧 di ujung kiri. Ksatria ⚔️ bukan di samping Ratu.", options: ["👑", "👸", "🤴", "👧", "⚔️", "🏰"], slots: 6, answer: "👧🏰👸👑🤴⚔️" },
        { id: 29, level: 29, question: "Pesawat ✈️ di ujung kiri. Helikopter 🚁 di samping Balon Udara 🎈. Roket 🚀 di tengah. Mobil 🚗 bukan di samping Helikopter.", options: ["✈️", "🚁", "🎈", "🚀", "🚗", "⛵"], slots: 6, answer: "✈️⛵🚁🎈🚀🚗" },
        { id: 30, level: 30, question: "Rumah 🏠 di paling kiri. Pohon 🌳 di samping Bunga 🌻. Sungai 🏞️ di tengah. Gunung ⛰️ bukan di samping Pohon.", options: ["🏠", "🌳", "🌻", "🏞️", "⛰️", "🛤️"], slots: 6, answer: "🏠🛤️🌳🌻🏞️⛰️" },
    ];
    // Pastikan ID soal unik dan level sesuai
    const [psgCurrentPuzzle, setPsgCurrentPuzzle] = useState(null);
    const [psgUserInput, setPsgUserInput] = useState(''); // Untuk input jawaban
    const [psgFeedback, setPsgFeedback] = useState('');
    const [psgFeedbackColor, setPsgFeedbackColor] = useState('');
    const [psgLevel, setPsgLevel] = useState(1);
    const [psgScore, setPsgScore] = useState(0);
    const [psgIsExploding, setPsgIsExploding] = useState(false); // Untuk confetti

    useEffect(() => {
        if (subGame === 'puzzleSyaratGanda') {
            generatePsgNewPuzzle();
        }
    }, [psgLevel, subGame]);

    const generatePsgNewPuzzle = () => {
        const availablePuzzles = PSG_PUZZLES.filter(p => p.level === psgLevel);
        if (availablePuzzles.length === 0) {
            // Jika sudah mencapai level maksimum atau tidak ada puzzle lagi
            setPsgFeedback('Selamat! Kamu sudah menyelesaikan semua Puzzle Syarat Ganda! 🎉');
            setPsgFeedbackColor('purple');
            setPsgCurrentPuzzle(null); // Tandai game selesai
            return;
        }
        const randomPuzzle = getRandomElement(availablePuzzles);
        setPsgCurrentPuzzle(randomPuzzle);
        setPsgUserInput('');
        setPsgFeedback('');
        setPsgFeedbackColor('');
        setPsgIsExploding(false);
    };

    const handlePsgSolvePuzzle = () => {
        if (!psgUserInput.trim()) {
            setPsgFeedback('Tulis jawabanmu dulu ya! 🤔');
            setPsgFeedbackColor('orange');
            return;
        }

        // Normalisasi input jawaban dan jawaban benar
        // Buang semua spasi dan pastikan format konsisten dengan answer di PSG_PUZZLES
        const normalizeEmojiString = (str) => {
            // Ini akan membuang semua spasi dan mengubah string emoji menjadi urutan tanpa spasi
            // Contoh: "🐈 🐕 🐦" -> "🐈🐕🐦"
            return str.replace(/\s+/g, '');
        };

        const normalizedInput = normalizeEmojiString(psgUserInput);
        const normalizedAnswer = normalizeEmojiString(psgCurrentPuzzle.answer);

        if (normalizedInput === normalizedAnswer) {
            setPsgFeedback('Hebat! Kamu berhasil memecahkan teka-teki ini! 🎉');
            setPsgFeedbackColor('green');
            setPsgScore(prev => prev + 50);
            setPsgIsExploding(true);

            if (psgLevel < PSG_MAX_LEVEL) {
                // Beri waktu sejenak untuk confetti sebelum naik level
                setTimeout(() => {
                    setPsgIsExploding(false);
                    setPsgLevel(prev => prev + 1); // Naik level
                }, 2000); // Durasi confetti + pesan naik level
            } else {
                setPsFeedback(`Selesai! Kamu sudah menyelesaikan semua Puzzle Syarat Ganda! 🎉`);
                setPsFeedbackColor('purple');
                setTimeout(() => {
                    setPsIsExploding(false);
                }, 2000);
            }
        } else {
            setPsgFeedback('Aduh, jawaban salah. Coba lagi! 🤔');
            setPsgFeedbackColor('red');
            setPsScore(prev => Math.max(0, prev - 20)); // Kurangi skor lebih sedikit

            // Berikan petunjuk lebih baik (opsional, bisa diaktifkan/dinonaktifkan)
            // if (normalizedInput.length !== normalizedAnswer.length) {
            //     setPsgFeedback(prev => prev + " Jumlah jawabanmu kurang tepat.");
            // } else {
            //     // Bisa menambahkan logika yang lebih kompleks di sini untuk hint
            //     // Misal, "Pastikan posisi X dan Y sudah benar"
            // }
        }
    };


    // --- State & Logic untuk Kode Rahasia ---
    const KR_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // Perluas daftar kata dan variasi panjang kata
    const KR_KATA_RAHASIA = [
        'AYAM', 'BUKU', 'PENSIL', 'MEJA', 'BALON', 'GAJAH', 'KUCING', 'JERUK', 'RUMAH', 'HARIMAU',
        'SEKOLAH', 'PELANGI', 'LAPTOP', 'KOMPUTER', 'MATEMATIKA', 'INDONESIA', 'BERSAMA', 'CINTA', 'BAHAGIA',
        'PERSAHABATAN', 'PETUALANGAN', 'PENDIDIKAN', 'KREATIVITAS', 'MASADEPAN', 'KEBERANIAN', 'KETULUSAN',
        'KEBERSAMAAN', 'PENGETAHUAN', 'KESEHATAN', 'KEBAHAGIAAN'
    ];
    const KR_MAX_LEVEL = 30;

    const [krCurrentCode, setKrCurrentCode] = useState([]);
    const [krCorrectAnswerText, setKrCorrectAnswerText] = useState('');
    const [krUserInput, setKrUserInput] = useState('');
    const [krFeedback, setKrFeedback] = useState('');
    const [krFeedbackColor, setKrFeedbackColor] = useState('');
    const [krScore, setKrScore] = useState(0);
    const [krLevel, setKrLevel] = useState(1);
    const [krIsExploding, setKrIsExploding] = useState(false);

    useEffect(() => {
        if (subGame === 'kodeRahasia') {
            generateKrNewQuestion();
        }
    }, [krLevel, subGame]);

    const getRandomKrWord = () => {
        // Tingkatkan panjang kata seiring level
        let minLength = 4;
        let maxLength = 5;
        if (krLevel >= 5) { minLength = 5; maxLength = 7; }
        if (krLevel >= 10) { minLength = 6; maxLength = 8; }
        if (krLevel >= 15) { minLength = 7; maxLength = 9; }
        if (krLevel >= 20) { minLength = 8; maxLength = 10; }
        if (krLevel >= 25) { minLength = 9; maxLength = 12; }


        const filteredWords = KR_KATA_RAHASIA.filter(word => word.length >= minLength && word.length <= maxLength);
        if (filteredWords.length === 0) {
            // Fallback jika tidak ada kata yang cocok, ambil acak dari semua
            return getRandomElement(KR_KATA_RAHASIA);
        }
        return getRandomElement(filteredWords);
    };

    const generateKrNewQuestion = () => {
        const word = getRandomKrWord();
        const text = word.toUpperCase();
        const code = text.split('').map(char => KR_ALPHABET.indexOf(char) + 1);

        setKrCurrentCode(code);
        setKrCorrectAnswerText(text);
        setKrUserInput('');
        setKrFeedback('');
        setKrFeedbackColor('');
        setKrIsExploding(false);
    };

    const handleKrSubmit = () => {
        if (!krUserInput.trim()) {
            setKrFeedback('Tulis jawabanmu dulu ya! 🤔');
            setKrFeedbackColor('orange');
            return;
        }

        if (krUserInput.toUpperCase() === krCorrectAnswerText) {
            setKrFeedback('Luar biasa! Kode rahasia terpecahkan! 🎉');
            setKrFeedbackColor('green');
            setKrScore(prev => prev + 15);
            setKrIsExploding(true);

            if (krLevel < KR_MAX_LEVEL) {
                if ((krScore + 15) % 45 === 0) { // Naik level setiap 3 jawaban benar
                    setKrLevel(prev => prev + 1);
                    setKrFeedback(`Selamat! Kamu naik ke Level ${krLevel + 1}! 🚀`);
                    setKrFeedbackColor('purple');
                }
            } else {
                setKrFeedback(`Hebat! Kamu sudah menyelesaikan semua Level di Kode Rahasia! 🎉`);
                setKrFeedbackColor('purple');
            }

            setTimeout(() => {
                setKrIsExploding(false);
                if (krLevel < KR_MAX_LEVEL) {
                    generateKrNewQuestion();
                }
            }, 2500);
        } else {
            setKrFeedback(`Ups, kode salah. Coba lagi! 🤔 (Hint: A=1, B=2, dst)`);
            setKrFeedbackColor('red');
            setKrScore(prev => Math.max(0, prev - 7));
        }
    };

    // Fungsi untuk membuat daftar A-Z = 1-26
    const renderAlphabetList = () => {
        const listItems = [];
        for (let i = 0; i < KR_ALPHABET.length; i++) {
            listItems.push(
                <span key={KR_ALPHABET[i]} className={styles.alphabetItem}>
                    {KR_ALPHABET[i]}={i + 1}
                </span>
            );
        }
        return <div className={styles.alphabetList}>{listItems}</div>;
    };


    // --- Fungsi Umum untuk Menyimpan Progress Game ---
    const handleGameComplete = async (gameType, score, level) => {
        try {
            const currentGamesProgress = currentUser?.progress?.games || {};
            const currentGameTypeProgress = currentGamesProgress[gameType] || {};

            const updatedProgress = {
                games: {
                    ...currentGamesProgress,
                    [gameType]: {
                        highscore: Math.max(currentGameTypeProgress.highscore || 0, score),
                        level: level
                    }
                }
            };

            const updatedUser = await updateUserProgess(currentUser.username, updatedProgress);
            setCurrentUser(updatedUser);
            setMessage(`Game ${gameType} selesai! Skor: ${score}. Progressmu diperbarui! 🎉`);
            setMessageColor('green');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Gagal menyimpan progress game: ' + error.message);
            setMessageColor('red');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    // --- Render Game Content ---
    const renderGameContent = () => {
        switch (subGame) {
            case 'patternScanner':
                return (
                    <div className={styles.card}>
                        {psIsExploding && (
                            <div className={styles.confettiContainer}>
                                <ConfettiExplosion
                                    force={0.8}
                                    duration={3000}
                                    particleCount={150}
                                    width={1000}
                                    colors={['#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#9370DB']}
                                />
                            </div>
                        )}
                        <h3>🎮 Pattern Scanner</h3>
                        <p className={styles.descriptionText}>Deteksi pola berulang! Ayo tebak berikutnya!</p>
                        <div className={styles.gameArea}>
                            <p className={styles.questionText}>Pola: {psQuestionSequence.map((emoji, index) => (
                                <span key={index} className={styles.patternItem}>{emoji}</span>
                            ))} <span className={styles.patternItem}>?</span></p>
                            <input
                                type="text"
                                placeholder="Tebak warna berikutnya (merah/biru/kuning)"
                                className={styles.gameInput}
                                value={psUserInput}
                                onChange={(e) => setPsUserInput(e.target.value)}
                                onKeyPress={(e) => { if (e.key === 'Enter') handlePsSubmit(); }}
                            />
                        </div>
                        <p className={styles.gameScore}>Skor: {psScore} | Level: {psLevel} dari {PS_MAX_LEVEL}</p>
                        <p className={styles.feedbackMessage} style={{ color: psFeedbackColor }}>{psFeedback}</p>
                        <button onClick={handlePsSubmit} className={`${styles.actionButton} ${styles.primaryButton}`} disabled={psLevel > PS_MAX_LEVEL}>Periksa ✅</button>
                        <button onClick={() => {
                            setSubGame(null);
                            // Reset game states when returning to menu
                            setPsScore(0);
                            setPsLevel(1);
                        }} className={`${styles.actionButton} ${styles.secondaryButton}`}>Kembali</button>
                        <button onClick={() => handleGameComplete('patternScanner', psScore, psLevel)} className={`${styles.actionButton} ${styles.primaryButton}`}>Selesai Game Ini</button>
                    </div>
                );
            case 'memoryTrainer':
                return (
                    <div className={styles.card}>
                        {mtIsExploding && (
                            <div className={styles.confettiContainer}>
                                <ConfettiExplosion
                                    force={0.8}
                                    duration={3000}
                                    particleCount={150}
                                    width={1000}
                                    colors={['#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#9370DB']}
                                />
                            </div>
                        )}
                        <h3>🧠 Memory Trainer</h3>
                        <p className={styles.descriptionText}>Ingat urutan benda! Seberapa kuat ingatanmu?</p>
                        <div className={styles.gameArea}>
                            <p className={styles.questionText}>{mtFeedback}</p>
                            <div className={styles.objectDisplay}>
                                {mtGamePhase === 'memorize' ? (
                                    mtCurrentSequence.map((emoji, index) => (
                                        <span key={index} className={styles.objectEmoji}>{emoji}</span>
                                    ))
                                ) : (
                                    <p className={styles.instructionText}>Klik emoji di bawah ini sesuai urutan yang kamu ingat:</p>
                                )}
                            </div>
                            {mtGamePhase === 'recall' && (
                                <div className={styles.inputOptions}>
                                    {MT_EMOJIS.map((emoji, index) => (
                                        <button key={index} className={styles.emojiOptionButton} onClick={() => handleMtEmojiClick(emoji)}>
                                            {emoji}
                                        </button>
                                    ))}
                                    <p className={styles.recallDisplay}>Urutanmu: {mtUserRecall.join(' ')}</p>
                                    <button onClick={checkMtAnswer} className={`${styles.actionButton} ${styles.primaryButton}`}>Periksa Urutan</button>
                                </div>
                            )}
                        </div>
                        <p className={styles.gameScore}>Skor: {mtScore} | Level: {mtLevel} dari {MT_MAX_LEVEL}</p>
                        <p className={styles.feedbackMessage} style={{ color: mtFeedbackColor }}>{mtFeedback}</p>
                        <button onClick={() => {
                            setSubGame(null);
                            // Reset game states
                            setMtScore(0);
                            setMtLevel(1);
                        }} className={`${styles.actionButton} ${styles.secondaryButton}`}>Kembali</button>
                        <button onClick={() => handleGameComplete('memoryTrainer', mtScore, mtLevel)} className={`${styles.actionButton} ${styles.primaryButton}`}>Selesai Game Ini</button>
                    </div>
                );
            case 'puzzleSyaratGanda':
                return (
                    <div className={styles.card}>
                        {psgIsExploding && (
                            <div className={styles.confettiContainer}>
                                <ConfettiExplosion
                                    force={0.8}
                                    duration={3000}
                                    particleCount={150}
                                    width={1000}
                                    colors={['#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#9370DB']}
                                />
                            </div>
                        )}
                        <h3>🧩 Puzzle Syarat Ganda</h3>
                        <p className={styles.descriptionText}>Ayo susun benda-benda sesuai petunjuk! Gunakan logikamu!</p>

                        {psgCurrentPuzzle ? (
                            <div className={styles.gameArea}>
                                <p className={styles.questionText}>{psgCurrentPuzzle.question}</p>
                                {/* Menampilkan slot kosong */}
                                <div className={styles.puzzleBoard}>
                                    {Array.from({ length: psgCurrentPuzzle.slots }).map((_, i) => (
                                        <span key={i} className={styles.puzzleSlot}>?</span>
                                    ))}
                                </div>
                                {/* Menampilkan pilihan objek */}
                                <p className={styles.instructionText}>Pilihan benda: {psgCurrentPuzzle.options.join(' ')}</p>
                                <p className={styles.instructionText}>
                                    Tuliskan urutannya di kotak bawah. Contoh: {psgCurrentPuzzle.options.slice(0, 2).join('')}
                                    {psgCurrentPuzzle.options.length > 2 && ` ${psgCurrentPuzzle.options[2]}`}{psgCurrentPuzzle.options.length > 3 && ` ${psgCurrentPuzzle.options[3]}`}
                                    {psgCurrentPuzzle.options.length > 4 && ` ${psgCurrentPuzzle.options[4]}`}
                                    {psgCurrentPuzzle.options.length > 5 && ` ${psgCurrentPuzzle.options[5]}`}
                                    (gunakan spasi untuk memisahkan)
                                </p>
                                <input
                                    type="text"
                                    placeholder="Contoh: 🐕 🐈 🐦"
                                    className={styles.gameInput}
                                    value={psgUserInput}
                                    onChange={(e) => setPsgUserInput(e.target.value)}
                                    onKeyPress={(e) => { if (e.key === 'Enter') handlePsgSolvePuzzle(); }}
                                />
                            </div>
                        ) : (
                            <p className={styles.feedbackMessage}>Memuat puzzle...</p>
                        )}
                        <p className={styles.gameScore}>Skor: {psgScore} | Level: {psgLevel} dari {PSG_MAX_LEVEL}</p>
                        <p className={styles.feedbackMessage} style={{ color: psgFeedbackColor }}>{psgFeedback}</p>
                        <button onClick={handlePsgSolvePuzzle} className={`${styles.actionButton} ${styles.primaryButton}`} disabled={psgLevel > PSG_MAX_LEVEL}>Coba Pecahkan ✅</button>
                        <button onClick={() => {
                            setSubGame(null);
                            // Reset game states
                            setPsgScore(0);
                            setPsgLevel(1);
                        }} className={`${styles.actionButton} ${styles.secondaryButton}`}>Kembali</button>
                        <button onClick={() => handleGameComplete('puzzleSyaratGanda', psgScore, psgLevel)} className={`${styles.actionButton} ${styles.primaryButton}`}>Selesai Game Ini</button>
                    </div>
                );
            case 'kodeRahasia':
                return (
                    <div className={styles.card}>
                        {krIsExploding && (
                            <div className={styles.confettiContainer}>
                                <ConfettiExplosion
                                    force={0.8}
                                    duration={3000}
                                    particleCount={150}
                                    width={1000}
                                    colors={['#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#9370DB']}
                                />
                            </div>
                        )}
                        <h3>🔑 Kode Rahasia</h3>
                        <p className={styles.descriptionText}>Pecahkan kode rahasia! Setiap huruf punya angka rahasia (A=1, B=2, dst).</p>
                        <div className={styles.gameArea}>
                            <p className={styles.questionText}>Kode: <span className={styles.codeHighlight}>{krCurrentCode.join('-')}</span></p>
                            <input
                                type="text"
                                placeholder="Tuliskan hurufnya (contoh: HELLO)"
                                className={styles.gameInput}
                                value={krUserInput}
                                onChange={(e) => setKrUserInput(e.target.value)}
                                onKeyPress={(e) => { if (e.key === 'Enter') handleKrSubmit(); }}
                            />
                            {/* Tambahkan daftar urutan A-Z di sini */}
                            <p className={styles.instructionText} style={{ marginTop: '20px', fontWeight: 'bold' }}>Kunci Kode Rahasia:</p>
                            {renderAlphabetList()}
                        </div>
                        <p className={styles.gameScore}>Skor: {krScore} | Level: {krLevel} dari {KR_MAX_LEVEL}</p>
                        <p className={styles.feedbackMessage} style={{ color: krFeedbackColor }}>{krFeedback}</p>
                        <button onClick={handleKrSubmit} className={`${styles.actionButton} ${styles.primaryButton}`} disabled={krLevel > KR_MAX_LEVEL}>Pecahkan Kode ✅</button>
                        <button onClick={() => {
                            setSubGame(null);
                            // Reset game states
                            setKrScore(0);
                            setKrLevel(1);
                        }} className={`${styles.actionButton} ${styles.secondaryButton}`}>Kembali</button>
                        <button onClick={() => handleGameComplete('kodeRahasia', krScore, krLevel)} className={`${styles.actionButton} ${styles.primaryButton}`}>Selesai Game Ini</button>
                    </div>
                );
            default:
                return (
                    <div className={styles.card}>
                        <h3>Ayo Bermain Game! 🎮</h3>
                        <p className={styles.descriptionText}>Pilih permainan logika yang ingin kamu mainkan:</p>
                        <div className={styles.menuGrid}>
                            <button onClick={() => setSubGame('patternScanner')} className={styles.menuCard}>
                                Pattern Scanner <span role="img" aria-label="pattern">🎨</span>
                            </button>
                            <button onClick={() => setSubGame('memoryTrainer')} className={styles.menuCard}>
                                Memory Trainer <span role="img" aria-label="memory">🧠</span>
                            </button>
                            <button onClick={() => setSubGame('puzzleSyaratGanda')} className={styles.menuCard}>
                                Puzzle Syarat Ganda <span role="img" aria-label="puzzle">🧩</span>
                            </button>
                            <button onClick={() => setSubGame('kodeRahasia')} className={styles.menuCard}>
                                Kode Rahasia <span role="img" aria-label="code">🔒</span>
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
                {message && <p style={{ color: messageColor, textAlign: 'center', marginBottom: '15px' }}>{message}</p>}
                {renderGameContent()}
            </div>
        </div>
    );
};

export default GamesPage;