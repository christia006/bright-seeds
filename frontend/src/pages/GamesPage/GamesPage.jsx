import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header/Header';
import styles from './GamesPage.module.css';
import ConfettiExplosion from 'react-confetti-explosion'; // Untuk efek konfeti
import { useNavigate } from 'react-router-dom'; // Untuk navigasi ke Dashboard

// Helper function untuk menghasilkan angka acak
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function untuk mendapatkan elemen acak dari array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function untuk mengacak array
const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
};

// --- Data & Logic untuk Pattern Scanner ---
const PS_EMOJIS = [
    '🔴', '🔵', '🟡', '🟢', '🟣', '🟠', '🟤', '⚪', '⬛', '🟦', '🟨', '🟥', '🟩',
    '⭐', '💖', '💡', '🌈', '🚀', '🍎', '⚽', '🌸', '🐠', '🚗', '🚲', '🎈', '🎁',
    '🍦', '🍰', '🍩', '🍫', '🐥', '🐸', '🐢', '🦋', '🐞', '🐝', '🐛', '🐌', '🦀',
    '🌞', '🌛', '☁️', '⚡', '💧', '🔥', '🌊', '🌲', '🌳', '🌻', '🌷', '🍄', '🌾'
];
const PS_PATTERN_LENGTHS = [3, 4, 5, 6]; // Panjang pola yang lebih bervariasi
const PS_SEQUENCE_DISPLAY_LENGTHS = [5, 6, 7, 8, 9, 10]; // Panjang sequence yang ditampilkan

const getEmojiName = (emoji) => {
    const emojiMap = {
        '🔴': 'merah', '🔵': 'biru', '🟡': 'kuning', '🟢': 'hijau',
        '🟣': 'ungu', '🟠': 'oranye', '🟤': 'cokelat', '⚪': 'putih',
        '⬛': 'hitam', '🟦': 'biru', '🟨': 'kuning', '🟥': 'merah', '🟩': 'hijau',
        '⭐': 'bintang', '💖': 'hati', '💡': 'lampu', '🌈': 'pelangi',
        '🚀': 'roket', '🍎': 'apel', '⚽': 'bola', '🌸': 'bunga',
        '🐠': 'ikan', '🚗': 'mobil', '🚲': 'sepeda', '🎈': 'balon', '🎁': 'hadiah',
        '🍦': 'es krim', '🍰': 'kue', '🍩': 'donat', '🍫': 'cokelat',
        '🐥': 'anak ayam', '🐸': 'katak', '🐢': 'kura-kura', '🦋': 'kupu-kupu',
        '🐞': 'kumbang', '🐝': 'lebah', '🐛': 'ulat', '🐌': 'siput', '🦀': 'kepiting',
        '🌞': 'matahari', '🌛': 'bulan', '☁️': 'awan', '⚡': 'petir',
        '💧': 'tetesan air', '🔥': 'api', '🌊': 'ombak', '🌲': 'pohon pinus',
        '🌳': 'pohon', '🌻': 'bunga matahari', '🌷': 'tulip', '🍄': 'jamur', '🌾': 'gandum'
    };
    return emojiMap[emoji] || 'emoji ini';
};

// --- Data & Logic untuk Memory Trainer ---
const MT_EMOJIS = [
    '🍎', '⚽', '🌟', '🌸', '🐠', '🚗', '🚀', '🌈', '🚲', '🎈', '🎁', '💡', '🎵', '🍪',
    '🍦', '🍰', '🍩', '🍫', '🐥', '🐸', '🐢', '🦋', '🐞', '🐝', '🐛', '🐌', '🦀',
    '🌞', '🌛', '☁️', '⚡', '💧', '🔥', '🌊', '🌲', '🌳', '🌻', '🌷', '🍄', '🌾',
    '👑', '💎', '💰', '🔑', '🔒', '🔔', '📚', '✏️', '✂️', '📏', '📎', '📌', '🗓️', '⏰'
];
const MT_SEQUENCE_LENGTHS = [3, 4, 5, 6, 7, 8]; // Panjang sequence yang lebih bervariasi

// --- Data & Logic untuk Puzzle Syarat Ganda ---
const PSG_PUZZLES = [
    // Tambahan puzzle untuk mencapai 50+
    { id: 1, question: "Kucing 🐈 harus di tengah. Anjing 🐕 tidak boleh di samping Burung 🐦.", options: ["🐈", "🐕", "🐦"], slots: 3, answer: "🐕🐈🐦" },
    { id: 2, question: "Apel 🍎 di paling kiri. Pisang 🍌 di samping Jeruk 🍊.", options: ["🍎", "🍌", "🍊"], slots: 3, answer: "🍎🍊🍌" },
    { id: 3, question: "Buku 📚 di tengah. Pensil ✏️ di ujung kanan.", options: ["📚", "✏️", "✂️"], slots: 3, answer: "✂️📚✏️" },
    { id: 4, question: "Mobil 🚗 di paling kanan. Sepeda 🚲 bukan di samping Motor 🏍️.", options: ["🚗", "🚲", "🏍️"], slots: 3, answer: "🚲🏍️🚗" },
    { id: 5, question: "Bunga 🌸 di ujung kiri. Kupu-kupu 🦋 di samping Lebah 🐝.", options: ["🌸", "🦋", "🐝"], slots: 3, answer: "🌸🐝🦋" },
    { id: 6, question: "Merah 🔴 di ujung kiri. Biru 🔵 bukan di samping Kuning 🟡. Hijau 🟢 di ujung kanan.", options: ["🔴", "🔵", "🟡", "🟢"], slots: 4, answer: "🔴🟡🔵🟢" },
    { id: 7, question: "Sapi 🐄 di samping Ayam 🐔. Bebek 🦆 di paling kiri. Kuda 🐎 bukan di samping Bebek.", options: ["🐄", "🐔", "🦆", "🐎"], slots: 4, answer: "🦆🐄🐔🐎" },
    { id: 8, question: "Bintang 🌟 di tengah. Bulan 🌙 di ujung kanan. Matahari ☀️ di samping Bintang.", options: ["🌟", "🌙", "☀️", "☁️"], slots: 4, answer: "☁️☀️🌟🌙" },
    { id: 9, question: "Bola ⚽ di ujung kiri. Raket 🎾 di samping Kok 🏸. Gawang 🥅 di ujung kanan.", options: ["⚽", "🎾", "🏸", "🥅"], slots: 4, answer: "⚽🎾🏸🥅" },
    { id: 10, question: "Es Krim 🍦 di samping Kue 🍰. Donat 🍩 di ujung kiri. Cokelat 🍫 bukan di samping Kue.", options: ["🍦", "🍰", "🍩", "🍫"], slots: 4, answer: "🍩🍫🍦🍰" },
    { id: 11, question: "Pohon 🌳 di paling kiri. Bunga 🌸 di samping Rumput 🌱. Batu 🪨 bukan di samping Pohon.", options: ["🌳", "🌸", "🌱", "🪨", "💧"], slots: 5, answer: "🌳💧🌸🌱🪨" },
    { id: 12, question: "Payung ☔ di ujung kanan. Jaket 🧥 di samping Topi 🧢. Sepatu 👟 di tengah.", options: ["☔", "🧥", "🧢", "👟", "🧤"], slots: 5, answer: "🧥🧢👟🧤☔" },
    { id: 13, question: "Burung Hantu 🦉 di tengah. Serigala 🐺 di ujung kiri. Beruang 🐻 di samping Rusa 🦌.", options: ["🦉", "🐺", "🐻", "🦌", "🦊"], slots: 5, answer: "🐺🦊🐻🦉🦌" },
    { id: 14, question: "Pensil ✏️ di paling kiri. Penghapus eraser di samping Penggaris 📏. Buku Tulis 📓 di ujung kanan.", options: ["✏️", "eraser", "📏", "📓", "🖇️"], slots: 5, answer: "✏️eraser📏🖇️📓" },
    { id: 15, question: "Gitar 🎸 di tengah. Piano 🎹 di ujung kiri. Drum 🥁 di samping Mikrofon 🎤.", options: ["🎸", "🎹", "🥁", "🎤", "🎵"], slots: 5, answer: "🎹🎵🎤🎸🥁" },
    { id: 16, question: "Mangga 🥭 di paling kiri. Pisang 🍌 di samping Apel 🍎. Nanas 🍍 di ujung kanan. Jeruk 🍊 bukan di samping Mangga.", options: ["🥭", "🍌", "🍎", "🍍", "🍊"], slots: 5, answer: "🥭🍊🍌🍎🍍" },
    { id: 17, question: "Kapal 🚢 di ujung kanan. Perahu 🛶 di samping Pelampung 🛟. Layar ⛵ di tengah.", options: ["🚢", "🛶", "🛟", "⛵", "⚓"], slots: 5, answer: "⚓🛶🛟⛵🚢" },
    { id: 18, question: "Pizza 🍕 di paling kiri. Burger 🍔 di samping Kentang Goreng 🍟. Hotdog 🌭 di ujung kanan. Taco 🌮 bukan di samping Burger.", options: ["🍕", "🍔", "🍟", "🌭", "🌮"], slots: 5, answer: "🍕🌮🍔🍟🌭" },
    { id: 19, question: "Sepatu Roda 🛼 di tengah. Helm ⛑️ di ujung kiri. Bantalan Lutut 🛡️ di samping Sepatu Roda.", options: ["🛼", "⛑️", "🛡️", "🛹", "👟"], slots: 5, answer: "⛑️👟🛡️🛼🛹" },
    { id: 20, question: "Kamera 📸 di paling kiri. Foto 🖼️ di samping Video 🎞️. Lampu 💡 di ujung kanan. Tripod tripod bukan di samping Kamera.", options: ["📸", "🖼️", "🎞️", "💡", "tripod"], slots: 5, answer: "📸tripod🖼️🎞️💡" },
    { id: 21, question: "Merah 🔴 di paling kiri. Biru 🔵 bukan di samping Hijau 🟢. Kuning 🟡 di samping Ungu 🟣. Oranye 🟠 di ujung kanan.", options: ["🔴", "🔵", "🟡", "🟢", "🟣", "🟠"], slots: 6, answer: "🔴🟢🟡🟣🔵🟠" },
    { id: 22, question: "Angka 1️⃣ di tengah. Angka 2️⃣ di ujung kiri. Angka 3️⃣ di samping Angka 4️⃣. Angka 5️⃣ di ujung kanan.", options: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"], slots: 6, answer: "2️⃣6️⃣3️⃣1️⃣4️⃣5️⃣" },
    { id: 23, question: "Senyum 😊 di paling kiri. Sedih 😔 di samping Marah 😡. Terkejut 😲 di tengah. Bingung 😕 bukan di samping Sedih.", options: ["😊", "😔", "😡", "😲", "😕", "🥰"], slots: 6, answer: "😊🥰😔😲😡😕" },
    { id: 24, question: "Pulpen 🖊️ di ujung kanan. Kertas 📄 di samping Spidol 🖍️. Buku 📖 di paling kiri. Penghapus eraser bukan di samping Kertas.", options: ["🖊️", "📄", "🖍️", "📖", "eraser", "📎"], slots: 6, answer: "📖📎eraser📄🖍️🖊️" },
    { id: 25, question: "Gajah 🐘 di ujung kiri. Jerapah 🦒 di samping Zebra 🦓. Singa 🦁 di tengah. Harimau 🐅 bukan di samping Jerapah.", options: ["🐘", "🦒", "🦓", "🦁", "🐅", "🐒"], slots: 6, answer: "🐘🐒🦒🦓🦁🐅" },
    { id: 26, question: "Musim Semi 🌷 di tengah. Musim Panas ☀️ di ujung kiri. Musim Gugur 🍂 di samping Musim Dingin ❄️. Hujan 🌧️ di ujung kanan.", options: ["🌷", "☀️", "🍂", "❄️", "🌧️", "🌈"], slots: 6, answer: "☀️🌈🌷🍂❄️🌧️" },
    { id: 27, question: "Bulan 🌙 di ujung kanan. Bintang ⭐ di samping Awan ☁️. Matahari ☀️ di paling kiri. Petir ⚡ bukan di samping Bintang.", options: ["🌙", "⭐", "☁️", "☀️", "⚡", "🌈"], slots: 6, answer: "☀️🌈⭐☁️⚡🌙" },
    { id: 28, question: "Raja 👑 di tengah. Ratu 👸 di samping Pangeran 🤴. Putri 👧 di ujung kiri. Ksatria ⚔️ bukan di samping Ratu.", options: ["👑", "👸", "🤴", "👧", "⚔️", "🏰"], slots: 6, answer: "👧🏰👸👑🤴⚔️" },
    { id: 29, question: "Pesawat ✈️ di ujung kiri. Helikopter 🚁 di samping Balon Udara 🎈. Roket 🚀 di tengah. Mobil 🚗 bukan di samping Helikopter.", options: ["✈️", "🚁", "🎈", "🚀", "🚗", "⛵"], slots: 6, answer: "✈️⛵🚁🎈🚀🚗" },
    { id: 30, question: "Rumah 🏠 di paling kiri. Pohon 🌳 di samping Bunga 🌻. Sungai 🏞️ di tengah. Gunung ⛰️ bukan di samping Pohon.", options: ["🏠", "🌳", "🌻", "🏞️", "⛰️", "🛤️"], slots: 6, answer: "🏠🛤️🌳🌻🏞️⛰️" },
    // Tambahan puzzle untuk mencapai 50+ soal
    { id: 31, question: "Kopi ☕ di paling kiri. Teh 🍵 di samping Susu 🥛. Jus 🥤 di ujung kanan. Air 💧 bukan di samping Kopi.", options: ["☕", "🍵", "🥛", "🥤", "💧"], slots: 5, answer: "☕💧🍵🥛🥤" },
    { id: 32, question: "Meja 🪑 di tengah. Kursi 🪑 di samping Lampu 💡. Buku 📚 di ujung kiri. Pulpen 🖊️ bukan di samping Kursi.", options: ["🪑", "💡", "📚", "🖊️"], slots: 4, answer: "📚🪑💡🖊️" },
    { id: 33, question: "Gajah 🐘 di ujung kiri. Monyet 🐒 di samping Pisang 🍌. Zebra 🦓 di ujung kanan. Singa 🦁 bukan di samping Monyet.", options: ["🐘", "🐒", "🍌", "🦓", "🦁"], slots: 5, answer: "🐘🦁🐒🍌🦓" },
    { id: 34, question: "Kunci 🔑 di paling kiri. Pintu 🚪 di samping Jendela 🪟. Koper 💼 di ujung kanan. Tas 👜 bukan di samping Pintu.", options: ["🔑", "🚪", "🪟", "💼", "👜"], slots: 5, answer: "🔑👜🚪🪟💼" },
    { id: 35, question: "Gajah 🐘 di tengah. Tikus 🐭 di ujung kiri. Kucing 🐈 di samping Anjing 🐕. Burung 🐦 di ujung kanan.", options: ["🐘", "🐭", "🐈", "🐕", "🐦"], slots: 5, answer: "🐭🐈🐕🐘🐦" },
    { id: 36, question: "Baju 👕 di paling kiri. Celana 👖 di samping Topi 🧢. Sepatu 👟 di ujung kanan. Kaos Kaki 🧦 bukan di samping Baju.", options: ["👕", "👖", "🧢", "👟", "🧦"], slots: 5, answer: "👕🧦👖🧢👟" },
    { id: 37, question: "Mata 👁️ di tengah. Hidung 👃 di ujung kiri. Mulut 👄 di samping Telinga 👂. Rambut 💇‍♀️ di ujung kanan.", options: ["👁️", "👃", "👄", "👂", "💇‍♀️"], slots: 5, answer: "👃👄👂👁️💇‍♀️" },
    { id: 38, question: "Pohon 🌳 di paling kanan. Bunga 🌸 di samping Rumput 🌱. Air 💧 di ujung kiri. Batu 🪨 bukan di samping Pohon.", options: ["🌳", "🌸", "🌱", "💧", "🪨"], slots: 5, answer: "💧🌱🌸🌳🪨" },
    { id: 39, question: "Pulpen 🖊️ di tengah. Buku 📚 di ujung kiri. Tas 🎒 di samping Pensil ✏️. Penghapus eraser di ujung kanan.", options: ["🖊️", "📚", "🎒", "✏️", "eraser"], slots: 5, answer: "📚🎒✏️🖊️eraser" },
    { id: 40, question: "Komputer 💻 di paling kiri. Mouse 🖱️ di samping Keyboard ⌨️. Layar 🖥️ di ujung kanan. Headphone 🎧 bukan di samping Komputer.", options: ["💻", "🖱️", "⌨️", "🖥️", "🎧"], slots: 5, answer: "💻🎧🖱️⌨️🖥️" },
    { id: 41, question: "Susu 🥛 di tengah. Roti 🍞 di ujung kiri. Mentega 🧈 di samping Keju 🧀. Jus 🥤 di ujung kanan.", options: ["🥛", "🍞", "🧈", "🧀", "🥤"], slots: 5, answer: "🍞🧈🧀🥛🥤" },
    { id: 42, question: "Kopi ☕ di ujung kanan. Teh 🍵 di samping Gula 🍚. Cangkir ☕ di paling kiri. Sendok 🥄 bukan di samping Teh.", options: ["☕", "🍵", "🍚", "🥄", "☕"], slots: 5, answer: "☕🥄🍵🍚☕" }, // Cangkir dan Kopi sama, ini tricky
    { id: 43, question: "Sepeda 🚲 di paling kiri. Helm ⛑️ di samping Roda ⚙️. Rem 🛑 di ujung kanan. Lampu 💡 bukan di samping Sepeda.", options: ["🚲", "⛑️", "⚙️", "🛑", "💡"], slots: 5, answer: "🚲💡⛑️⚙️🛑" },
    { id: 44, question: "Topi 🧢 di tengah. Jaket 🧥 di ujung kiri. Sarung Tangan 🧤 di samping Syal 🧣. Kaos Kaki 🧦 di ujung kanan.", options: ["🧢", "🧥", "🧤", "🧣", "🧦"], slots: 5, answer: "🧥🧤🧣🧢🧦" },
    { id: 45, question: "Bulan 🌙 di paling kiri. Bintang ⭐ di samping Awan ☁️. Matahari ☀️ di ujung kanan. Pelangi 🌈 bukan di samping Bulan.", options: ["🌙", "⭐", "☁️", "☀️", "🌈"], slots: 5, answer: "🌙🌈⭐☁️☀️" },
    { id: 46, question: "Naga 🐉 di tengah. Peri 🧚 di ujung kiri. Kurcaci 🧑‍🎄 di samping Penyihir 🧙. Putri 👸 di ujung kanan.", options: ["🐉", "🧚", "🧑‍🎄", "🧙", "👸"], slots: 5, answer: "🧚🧑‍🎄🧙🐉👸" },
    { id: 47, question: "Robot 🤖 di paling kiri. Alien 👽 di samping Roket 🚀. Planet 🪐 di ujung kanan. Bintang ⭐ bukan di samping Robot.", options: ["🤖", "👽", "🚀", "🪐", "⭐"], slots: 5, answer: "🤖⭐👽🚀🪐" },
    { id: 48, question: "Gajah 🐘 di tengah. Harimau 🐅 di ujung kiri. Singa 🦁 di samping Zebra 🦓. Monyet 🐒 di ujung kanan.", options: ["🐘", "🐅", "🦁", "🦓", "🐒"], slots: 5, answer: "🐅🦁🦓🐘🐒" },
    { id: 49, question: "Papan Tulis 칠판 di paling kiri. Kapur 🖍️ di samping Penghapus 🧽. Meja 🪑 di ujung kanan. Kursi 🪑 bukan di samping Papan Tulis.", options: ["칠판", "🖍️", "🧽", "🪑", "🪑"], slots: 5, answer: "칠판🪑🖍️🧽🪑" }, // Dua kursi
    { id: 50, question: "Pulau 🏝️ di tengah. Laut 🌊 di ujung kiri. Kapal 🚢 di samping Ikan 🐠. Gunung ⛰️ di ujung kanan.", options: ["🏝️", "🌊", "🚢", "🐠", "⛰️"], slots: 5, answer: "🌊🚢🐠🏝️⛰️" },
    { id: 51, question: "Bunga Mawar 🌹 di paling kiri. Bunga Melati 🌼 di samping Bunga Tulip 🌷. Bunga Anggrek  orchid di ujung kanan. Bunga Matahari 🌻 bukan di samping Mawar.", options: ["🌹", "🌼", "🌷", "orchid", "🌻"], slots: 5, answer: "🌹🌻🌼🌷orchid" },
    { id: 52, question: "Kamera 📸 di tengah. Lensa 렌즈 di ujung kiri. Flash ⚡ di samping Tripod tripod. Foto 🖼️ di ujung kanan.", options: ["📸", "렌즈", "⚡", "tripod", "🖼️"], slots: 5, answer: "렌즈⚡tripod📸🖼️" },
];

// --- Data & Logic untuk Kode Rahasia ---
const KR_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const KR_KATA_RAHASIA = [
    'AYAM', 'BUKU', 'PENSIL', 'MEJA', 'BALON', 'GAJAH', 'KUCING', 'JERUK', 'RUMAH', 'HARIMAU',
    'SEKOLAH', 'PELANGI', 'LAPTOP', 'KOMPUTER', 'MATEMATIKA', 'INDONESIA', 'BERSAMA', 'CINTA', 'BAHAGIA',
    'PERSAHABATAN', 'PETUALANGAN', 'PENDIDIKAN', 'KREATIVITAS', 'MASADEPAN', 'KEBERANIAN', 'KETULUSAN',
    'KEBERSAMAAN', 'PENGETAHUAN', 'KESEHATAN', 'KEBAHAGIAAN', 'SAHABAT', 'KELUARGA', 'CERDAS', 'SEMANGAT',
    'JUARA', 'SENYUM', 'TERTAWA', 'INDONESIAKU', 'PANCASILA', 'MERDEKA', 'GEMBIRA', 'PETUALANG',
    // Kata-kata lebih panjang dan "menjebak"
    'KECERDASAN', 'PETUALANGAN', 'KEBAHAGIAAN', 'KEMANDIRIAN', 'KEJUJURAN', 'PERDAMAIAN', 'PERSATUAN',
    'KEMAKMURAN', 'KESEIMBANGAN', 'KEBERHASILAN', 'KEDISIPLINAN', 'KESABARAN', 'KASIHAYANG', 'KEINDAHAN',
    'KERJAKERAS', 'KEJUARAAN', 'KEMENANGAN', 'KEUNIKAN', 'KEKUATAN', 'KEGEMBIRAAN', 'KEDAMAIAN',
    'KEMURNIAN', 'KESUCIAN', 'KESEMPURNAAN', 'KETERAMPILAN', 'KEMAMPUAN', 'KETERBUKAAN', 'KEJUJURAN',
    'KEBERANIAN', 'KECERIAAN', 'KEBAIKAN', 'KEHANGATAN', 'KEISTIMEWAAN', 'KEBERKAHAN', 'KEKUATAN'
];

const GamesPage = () => {
    const [subGame, setSubGame] = useState(null); // State untuk mengontrol game mana yang aktif
    const navigate = useNavigate(); // Inisialisasi hook useNavigate

    // --- State & Logic untuk Pattern Scanner ---
    const [psCurrentPattern, setPsCurrentPattern] = useState([]);
    const [psQuestionSequence, setPsQuestionSequence] = useState([]);
    const [psCorrectAnswerEmoji, setPsCorrectAnswerEmoji] = useState('');
    const [psAnswerOptions, setPsAnswerOptions] = useState([]); // Opsi jawaban untuk tombol
    const [psFeedback, setPsFeedback] = useState('');
    const [psFeedbackColor, setPsFeedbackColor] = useState('');
    const [psScore, setPsScore] = useState(0);
    const [psIsExploding, setPsIsExploding] = useState(false);

    useEffect(() => {
        if (subGame === 'patternScanner') {
            generatePsNewQuestion();
        }
    }, [subGame]); // Hanya bergantung pada subGame

    const generatePsNewQuestion = () => {
        const patternLength = getRandomElement(PS_PATTERN_LENGTHS);
        const newPattern = Array.from({ length: patternLength }, () => getRandomElement(PS_EMOJIS));

        const sequenceLength = getRandomElement(PS_SEQUENCE_DISPLAY_LENGTHS);
        const fullSequence = [];
        for (let i = 0; i < sequenceLength + 1; i++) { // +1 untuk jawaban
            fullSequence.push(newPattern[i % patternLength]);
        }

        const qSequence = fullSequence.slice(0, sequenceLength);
        const answerEmoji = fullSequence[sequenceLength];

        // Buat opsi jawaban
        let options = [answerEmoji];
        while (options.length < 4) { // 4 pilihan jawaban
            const randomEmoji = getRandomElement(PS_EMOJIS);
            if (!options.includes(randomEmoji)) {
                options.push(randomEmoji);
            }
        }
        options = shuffleArray(options); // Acak urutan pilihan

        setPsCurrentPattern(newPattern);
        setPsQuestionSequence(qSequence);
        setPsCorrectAnswerEmoji(answerEmoji);
        setPsAnswerOptions(options); // Set opsi jawaban
        setPsFeedback('');
        setPsFeedbackColor('');
        setPsIsExploding(false);
    };

    const handlePsAnswerClick = (clickedEmoji) => { // Mengubah handlePsSubmit menjadi handlePsAnswerClick
        if (clickedEmoji === psCorrectAnswerEmoji) {
            setPsFeedback('Hebat! Jawabanmu benar! 🎉 Lanjut ke soal berikutnya!');
            setPsFeedbackColor('green');
            setPsScore(prev => prev + 10);
            setPsIsExploding(true);

            setTimeout(() => {
                setPsIsExploding(false);
                generatePsNewQuestion();
            }, 2500); // Jeda untuk konfeti
        } else {
            setPsFeedback(`Aduh, salah. Jawaban yang benar adalah ${getEmojiName(psCorrectAnswerEmoji)} ${psCorrectAnswerEmoji}. Coba lagi! 🤔`);
            setPsFeedbackColor('red');
            setPsScore(prev => Math.max(0, prev - 5)); // Kurangi skor, minimal 0
        }
    };

    // --- State & Logic untuk Memory Trainer ---
    const [mtGamePhase, setMtGamePhase] = useState('memorize');
    const [mtCurrentSequence, setMtCurrentSequence] = useState([]);
    const [mtUserRecall, setMtUserRecall] = useState([]);
    const [mtScore, setMtScore] = useState(0);
    const [mtFeedback, setMtFeedback] = useState('');
    const [mtFeedbackColor, setMtFeedbackColor] = useState('');
    const [mtIsExploding, setMtIsExploding] = useState(false);

    useEffect(() => {
        if (subGame === 'memoryTrainer') {
            generateMtNewSequence();
        }
    }, [subGame]);

    const generateMtNewSequence = () => {
        const length = getRandomElement(MT_SEQUENCE_LENGTHS);
        const newSeq = Array.from({ length }, () => getRandomElement(MT_EMOJIS));

        setMtCurrentSequence(newSeq);
        setMtUserRecall([]);
        setMtGamePhase('memorize');
        setMtFeedback('Ingat urutan ini baik-baik!');
        setMtFeedbackColor('blue');
        setMtIsExploding(false);

        const displayDuration = Math.max(1500, 3000 - (length * 200)); // Durasi tampilan
        setTimeout(() => {
            setMtGamePhase('recall');
            setMtFeedback('Sekarang, coba urutkan kembali!');
            setMtFeedbackColor('black');
        }, displayDuration + (length * 300)); // Tambah jeda per emoji
    };

    const handleMtEmojiClick = (emoji) => {
        if (mtGamePhase === 'recall') {
            setMtUserRecall(prev => [...prev, emoji]);
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
            setMtFeedback('Luar biasa! Ingatanmu hebat! 🎉 Lanjut ke soal berikutnya!');
            setMtFeedbackColor('green');
            setMtScore(prev => prev + 20);
            setMtIsExploding(true);

            setTimeout(() => {
                setMtIsExploding(false);
                generateMtNewSequence();
            }, 2500); // Jeda untuk konfeti
        } else {
            setMtFeedback(`Aduh, salah. Urutan yang benar adalah: ${mtCurrentSequence.join(' ')}. Coba lagi! 🤔`);
            setMtFeedbackColor('red');
            setMtScore(prev => Math.max(0, prev - 10)); // Kurangi skor, minimal 0
            setTimeout(() => {
                setMtFeedback('Coba lagi!');
                setMtFeedbackColor('black');
                setMtUserRecall([]); // Bersihkan recall untuk coba lagi
            }, 2000);
        }
    };

    // --- State & Logic untuk Puzzle Syarat Ganda ---
    const [psgCurrentPuzzle, setPsgCurrentPuzzle] = useState(null);
    const [psgUserInput, setPsgUserInput] = useState('');
    const [psgFeedback, setPsgFeedback] = useState('');
    const [psgFeedbackColor, setPsgFeedbackColor] = useState('');
    const [psgScore, setPsgScore] = useState(0);
    const [psgIsExploding, setPsgIsExploding] = useState(false);

    useEffect(() => {
        if (subGame === 'puzzleSyaratGanda') {
            generatePsgNewPuzzle();
        }
    }, [subGame]);

    const generatePsgNewPuzzle = () => {
        const randomPuzzle = getRandomElement(PSG_PUZZLES);
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

        const normalizeEmojiString = (str) => {
            return str.replace(/\s+/g, ''); // Buang semua spasi
        };

        const normalizedInput = normalizeEmojiString(psgUserInput);
        const normalizedAnswer = normalizeEmojiString(psgCurrentPuzzle.answer);

        if (normalizedInput === normalizedAnswer) {
            setPsgFeedback('Hebat! Kamu berhasil memecahkan teka-teki ini! 🎉 Lanjut ke soal berikutnya!');
            setPsgFeedbackColor('green');
            setPsgScore(prev => prev + 50);
            setPsgIsExploding(true);

            setTimeout(() => {
                setPsgIsExploding(false);
                generatePsgNewPuzzle();
            }, 2500); // Jeda untuk konfeti
        } else {
            setPsgFeedback('Aduh, jawaban salah. Coba lagi! 🤔');
            setPsgFeedbackColor('red');
            setPsgScore(prev => Math.max(0, prev - 20)); // Kurangi skor, minimal 0
        }
    };

    // --- State & Logic untuk Kode Rahasia ---
    const [krCurrentCode, setKrCurrentCode] = useState([]);
    const [krCorrectAnswerText, setKrCorrectAnswerText] = useState('');
    const [krUserInput, setKrUserInput] = useState('');
    const [krFeedback, setKrFeedback] = useState('');
    const [krFeedbackColor, setKrFeedbackColor] = useState('');
    const [krScore, setKrScore] = useState(0);
    const [krIsExploding, setKrIsExploding] = useState(false);

    useEffect(() => {
        if (subGame === 'kodeRahasia') {
            generateKrNewQuestion();
        }
    }, [subGame]);

    const getRandomKrWord = () => {
        // Mengambil kata secara acak dari daftar yang diperluas
        return getRandomElement(KR_KATA_RAHASIA);
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
            setKrFeedback('Luar biasa! Kode rahasia terpecahkan! 🎉 Lanjut ke soal berikutnya!');
            setKrFeedbackColor('green');
            setKrScore(prev => prev + 15);
            setKrIsExploding(true);

            setTimeout(() => {
                setKrIsExploding(false);
                generateKrNewQuestion();
            }, 2500); // Jeda untuk konfeti
        } else {
            setKrFeedback(`Ups, kode salah. Coba lagi! 🤔 (Hint: A=1, B=2, dst)`);
            setKrFeedbackColor('red');
            setKrScore(prev => Math.max(0, prev - 7)); // Kurangi skor, minimal 0
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

    // Handler untuk navigasi ke Dashboard
    const handleGoToDashboard = () => {
        navigate('/dashboard'); // Navigasi ke halaman Dashboard
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
                                    force={1.2} // Lebih kuat
                                    duration={4000} // Lebih lama
                                    particleCount={200} // Lebih banyak
                                    width={1500} // Lebih lebar
                                    height={1500} // Lebih tinggi
                                    colors={['#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#9370DB', '#FF69B4']} // Warna cerah
                                />
                            </div>
                        )}
                        <h3 className={styles.gameTitle}>🎮 Pattern Scanner</h3>
                        <p className={styles.descriptionText}>Deteksi pola berulang! Ayo tebak berikutnya!</p>
                        <div className={styles.gameArea}>
                            <p className={styles.questionText}>Pola: {psQuestionSequence.map((emoji, index) => (
                                <span key={index} className={styles.patternItem}>{emoji}</span>
                            ))} <span className={styles.patternItem}>?</span></p>
                            
                            {/* Tombol pilihan jawaban */}
                            <div className={styles.psOptionButtonsContainer}>
                                {psAnswerOptions.map((optionEmoji, index) => (
                                    <button
                                        key={index}
                                        className={styles.psOptionButton}
                                        onClick={() => handlePsAnswerClick(optionEmoji)}
                                    >
                                        {optionEmoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <p className={styles.gameScore}>Skor: {psScore}</p>
                        <p className={styles.feedbackMessage} style={{ color: psFeedbackColor }}>{psFeedback}</p>
                        {/* Tombol Periksa dihapus karena sudah ada klik pada pilihan */}
                        <button onClick={() => {
                            setSubGame(null);
                            setPsScore(0); // Reset skor saat kembali
                        }} className={`${styles.actionButton} ${styles.secondaryButton}`}>Kembali ke Menu</button>
                    </div>
                );
            case 'memoryTrainer':
                return (
                    <div className={styles.card}>
                        {mtIsExploding && (
                            <div className={styles.confettiContainer}>
                                <ConfettiExplosion
                                    force={1.2}
                                    duration={4000}
                                    particleCount={200}
                                    width={1500}
                                    height={1500}
                                    colors={['#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#9370DB', '#FF69B4']}
                                />
                            </div>
                        )}
                        <h3 className={styles.gameTitle}>🧠 Memory Trainer</h3>
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
                        <p className={styles.gameScore}>Skor: {mtScore}</p>
                        <p className={styles.feedbackMessage} style={{ color: mtFeedbackColor }}>{mtFeedback}</p>
                        <button onClick={() => {
                            setSubGame(null);
                            setMtScore(0); // Reset skor saat kembali
                        }} className={`${styles.actionButton} ${styles.secondaryButton}`}>Kembali ke Menu</button>
                    </div>
                );
            case 'puzzleSyaratGanda':
                return (
                    <div className={styles.card}>
                        {psgIsExploding && (
                            <div className={styles.confettiContainer}>
                                <ConfettiExplosion
                                    force={1.2}
                                    duration={4000}
                                    particleCount={200}
                                    width={1500}
                                    height={1500}
                                    colors={['#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#9370DB', '#FF69B4']}
                                />
                            </div>
                        )}
                        <h3 className={styles.gameTitle}>🧩 Puzzle Syarat Ganda</h3>
                        <p className={styles.descriptionText}>Ayo susun benda-benda sesuai petunjuk! Gunakan logikamu!</p>

                        {psgCurrentPuzzle ? (
                            <div className={styles.gameArea}>
                                <p className={styles.questionText}>{psgCurrentPuzzle.question}</p>
                                <div className={styles.slotsContainer}>
                                    {Array.from({ length: psgCurrentPuzzle.slots }).map((_, idx) => (
                                        <span key={idx} className={styles.slotBox}></span>
                                    ))}
                                </div>
                                <div className={styles.optionsContainer}>
                                    {psgCurrentPuzzle.options.map((option, idx) => (
                                        <button key={idx} className={styles.optionButton} onClick={() => setPsgUserInput(prev => prev + option)}>
                                            {option}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    className={styles.gameInput}
                                    value={psgUserInput}
                                    onChange={(e) => setPsgUserInput(e.target.value)}
                                    placeholder="Susun di sini (contoh: 🍎🍊🍌)"
                                    onKeyPress={(e) => { if (e.key === 'Enter') handlePsgSolvePuzzle(); }}
                                />
                                <button onClick={() => setPsgUserInput('')} className={styles.clearButton}>Bersihkan</button>
                            </div>
                        ) : (
                            <p className={styles.feedbackMessage}>Memuat puzzle...</p>
                        )}
                        <p className={styles.gameScore}>Skor: {psgScore}</p>
                        <p className={styles.feedbackMessage} style={{ color: psgFeedbackColor }}>{psgFeedback}</p>
                        <button onClick={handlePsgSolvePuzzle} className={`${styles.actionButton} ${styles.primaryButton}`}>Periksa ✅</button>
                        <button onClick={() => {
                            setSubGame(null);
                            setPsgScore(0); // Reset skor saat kembali
                        }} className={`${styles.actionButton} ${styles.secondaryButton}`}>Kembali ke Menu</button>
                    </div>
                );
            case 'kodeRahasia':
                return (
                    <div className={styles.card}>
                        {krIsExploding && (
                            <div className={styles.confettiContainer}>
                                <ConfettiExplosion
                                    force={1.2}
                                    duration={4000}
                                    particleCount={200}
                                    width={1500}
                                    height={1500}
                                    colors={['#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#9370DB', '#FF69B4']}
                                />
                            </div>
                        )}
                        <h3 className={styles.gameTitle}>🔒 Kode Rahasia</h3>
                        <p className={styles.descriptionText}>Pecahkan kode angka menjadi kata! Gunakan daftar huruf!</p>
                        <div className={styles.gameArea}>
                            <p className={styles.codeDisplay}>Kode: {krCurrentCode.join(' - ')}</p>
                            <input
                                type="text"
                                className={styles.gameInput}
                                value={krUserInput}
                                onChange={(e) => setKrUserInput(e.target.value)}
                                placeholder="Tulis kata rahasianya..."
                                onKeyPress={(e) => { if (e.key === 'Enter') handleKrSubmit(); }}
                            />
                            {renderAlphabetList()} {/* Tampilkan daftar A-Z = 1-26 */}
                        </div>
                        <p className={styles.gameScore}>Skor: {krScore}</p>
                        <p className={styles.feedbackMessage} style={{ color: krFeedbackColor }}>{krFeedback}</p>
                        <button onClick={handleKrSubmit} className={`${styles.actionButton} ${styles.primaryButton}`}>Pecahkan Kode ✅</button>
                        <button onClick={() => {
                            setSubGame(null);
                            setKrScore(0); // Reset skor saat kembali
                        }} className={`${styles.actionButton} ${styles.secondaryButton}`}>Kembali ke Menu</button>
                    </div>
                );
            default:
                return (
                    <div className={styles.card}>
                        <h3 className={styles.gameTitle}>Pilih Game Seru! 🎉</h3>
                        <p className={styles.descriptionText}>Ayo mainkan game yang kamu suka dan asah otakmu!</p>
                        <div className={styles.gameMenuGrid}>
                            <button onClick={() => setSubGame('patternScanner')} className={styles.menuCard}>
                                <span role="img" aria-label="pattern scanner">🎨</span>
                                <h4>Pattern Scanner</h4>
                                <p>Tebak pola warna!</p>
                            </button>
                            <button onClick={() => setSubGame('memoryTrainer')} className={styles.menuCard}>
                                <span role="img" aria-label="memory trainer">🧠</span>
                                <h4>Memory Trainer</h4>
                                <p>Uji ingatanmu!</p>
                            </button>
                            <button onClick={() => setSubGame('puzzleSyaratGanda')} className={styles.menuCard}>
                                <span role="img" aria-label="puzzle">🧩</span>
                                <h4>Puzzle Syarat Ganda</h4>
                                <p>Susun benda sesuai petunjuk!</p>
                            </button>
                            <button onClick={() => setSubGame('kodeRahasia')} className={styles.menuCard}>
                                <span role="img" aria-label="secret code">🔒</span>
                                <h4>Kode Rahasia</h4>
                                <p>Pecahkan kode angka!</p>
                            </button>
                        </div>
                        {/* Tombol Dashboard */}
                        <button
                            onClick={handleGoToDashboard}
                            className={styles.dashboardButtonGames}
                        >
                            <span role="img" aria-label="dashboard">🏠</span> Dashboard Utama
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className={styles.gamesPageContainer}>
            <Header />
            <div className={styles.contentArea}>
                {renderGameContent()}
            </div>
        </div>
    );
};

export default GamesPage;
