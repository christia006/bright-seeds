// frontend/api/register.js
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

// Path ke users.json relatif terhadap root proyek Vercel
// Vercel akan menempatkan folder `backend` di root deployment
const USERS_DB_PATH = path.join(process.cwd(), 'backend', 'data', 'users.json');

// Helper to read users from the "database"
async function readUsers() {
    try {
        const data = await fs.readFile(USERS_DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Jika file tidak ada, buat file kosong
            await fs.writeFile(USERS_DB_PATH, '[]', 'utf8');
            return [];
        }
        console.error('Error membaca users DB:', error);
        return [];
    }
}

// Helper to write users to the "database"
async function writeUsers(users) {
    try {
        await fs.writeFile(USERS_DB_PATH, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error('Error menulis users DB:', error);
        // Ini adalah error yang akan sering muncul di Vercel karena file system tidak persisten
    }
}

// Handler untuk permintaan POST ke /api/register
module.exports = async (req, res) => {
    // Pastikan ini adalah permintaan POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Metode tidak diizinkan.' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Nama pengguna dan kata sandi diperlukan.' });
    }

    // --- PENTING: BAGIAN INI TIDAK AKAN BERFUNGSI PERSISTEN DI VERCEL ---
    // Data yang ditulis di sini akan hilang setelah fungsi selesai
    const users = await readUsers();
    if (users.find(u => u.username === username)) {
        return res.status(409).json({ message: 'Nama pengguna sudah ada.' });
    }
    // --- AKHIR DARI BAGIAN TIDAK PERSISTEN ---

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        username,
        password: hashedPassword,
        progress: {
            reading: { letters: [], syllables: [], sentences: [], level: 1 },
            writing: { letters: [], words: [], sentences: [], level: 1 },
            math: { numbers: [], counting: [], arithmetic: [], level: 1 },
            games: {
                patternScanner: { highscore: 0, level: 'Mudah' },
                memoryTrainer: { highscore: 0, level: 'Mudah' },
                puzzleSyaratGanda: { highscore: 0, level: 'Mudah' },
                kodeRahasia: { highscore: 0, level: 'Mudah' }
            },
            badges: []
        }
    };

    // --- PENTING: BAGIAN INI TIDAK AKAN BERFUNGSI PERSISTEN DI VERCEL ---
    users.push(newUser);
    await writeUsers(users);
    // --- AKHIR DARI BAGIAN TIDAK PERSISTEN ---

    res.status(201).json({ message: 'Pengguna berhasil terdaftar!' });
};