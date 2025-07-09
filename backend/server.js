const express = require('express');
const cors = require('cors');
const fs = require('fs').promises; // Menggunakan fs.promises untuk async/await
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
// const PORT = process.env.PORT || 5000; // Tidak perlu app.listen di Vercel Serverless Functions
const USERS_DB_PATH = path.join(__dirname, 'data', 'users.json');

// --- Middleware ---
app.use(express.json()); // Untuk parsing JSON body dari request

// KONFIGURASI CORS (SANGAT PENTING UNTUK MENANGANI MASALAH SEBELUMNYA)
// Ganti dengan URL frontend Vercel Anda dan URL lokal untuk pengembangan
const allowedOrigins = [
    'https://bright-seeds.vercel.app', // GANTI DENGAN URL ASLI FRONTEND VERCEL ANDA
    'http://localhost:3000' // Untuk pengembangan lokal
];

app.use(cors({
    origin: function (origin, callback) {
        // Izinkan permintaan tanpa origin (misalnya dari Postman, cURL, atau direktori lokal)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Izinkan semua metode yang relevan, termasuk OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'], // Penting untuk header yang dikirim dari frontend
    credentials: true // Diperlukan jika Anda mengirim cookie atau header Authorization
}));

// --- Helper Functions (untuk file JSON lokal - INGAT: Tidak Persisten di Vercel!) ---

// Ensure the data directory exists
async function ensureDataDirectory() {
    const dataDir = path.dirname(USERS_DB_PATH);
    try {
        await fs.mkdir(dataDir, { recursive: true });
    } catch (error) {
        console.error('Error ensuring data directory exists:', error);
        // Dalam lingkungan serverless Vercel, ini bisa terjadi jika direktori read-only.
        // Jika ini terjadi, itu adalah indikasi kuat Anda perlu database eksternal.
    }
}

// Helper to read users from the "database"
async function readUsers() {
    await ensureDataDirectory(); // Ensure dir exists before trying to read/create file
    try {
        const data = await fs.readFile(USERS_DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn('users.json not found, creating an empty array.');
            await fs.writeFile(USERS_DB_PATH, '[]', 'utf8'); // Create file if it doesn't exist
            return [];
        }
        console.error('Error reading users DB:', error);
        return []; // Return empty array on other errors
    }
}

// Helper to write users to the "database"
async function writeUsers(users) {
    await ensureDataDirectory();
    try {
        await fs.writeFile(USERS_DB_PATH, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing users DB:', error);
        // Sekali lagi, error di sini hampir pasti karena lingkungan Vercel tidak mengizinkan penulisan file.
    }
}

// --- Routes ---

// Register
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // --- PENTING: BAGIAN INI TIDAK AKAN BERFUNGSI PERSISTEN DI VERCEL ---
    const users = await readUsers();
    if (users.find(u => u.username === username)) {
        return res.status(409).json({ message: 'Username already exists.' });
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

    res.status(201).json({ message: 'User registered successfully!' });
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // --- PENTING: BAGIAN INI TIDAK AKAN BERFUNGSI PERSISTEN DI VERCEL ---
    const users = await readUsers();
    const user = users.find(u => u.username === username);
    // --- AKHIR DARI BAGIAN TIDAK PERSISTEN ---

    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    res.status(200).json({ message: 'Login successful!', user: userWithoutPassword });
});

// Get User Progress and Profile
app.get('/api/users/:username', async (req, res) => {
    const { username } = req.params;
    // --- PENTING: BAGIAN INI TIDAK AKAN BERFUNGSI PERSISTEN DI VERCEL ---
    const users = await readUsers();
    const user = users.find(u => u.username === username);
    // --- AKHIR DARI BAGIAN TIDAK PERSISTEN ---

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password; // Never send password

    res.status(200).json({ user: userWithoutPassword });
});

// Update User Progress
app.put('/api/users/:username/progress', async (req, res) => {
    const { username } = req.params;
    const { progress } = req.body;

    if (!progress) {
        return res.status(400).json({ message: 'Progress data is required.' });
    }

    // --- PENTING: BAGIAN INI TIDAK AKAN BERFUNGSI PERSISTEN DI VERCEL ---
    let users = await readUsers();
    const userIndex = users.findIndex(u => u.username === username);
    // --- AKHIR DARI BAGIAN TIDAK PERSISTEN ---

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found.' });
    }

    // Merge progress data
    users[userIndex].progress = {
        ...users[userIndex].progress,
        ...progress,
        reading: { ...users[userIndex].progress.reading, ...progress.reading },
        writing: { ...users[userIndex].progress.writing, ...progress.writing },
        math: { ...users[userIndex].progress.math, ...progress.math },
        games: { ...users[userIndex].progress.games, ...progress.games }
    };

    // --- PENTING: BAGIAN INI TIDAK AKAN BERFUNGSI PERSISTEN DI VERCEL ---
    await writeUsers(users);
    // --- AKHIR DARI BAGIAN TIDAK PERSISTEN ---

    const updatedUser = { ...users[userIndex] };
    delete updatedUser.password;

    res.status(200).json({ message: 'Progress updated successfully!', user: updatedUser });
});

// --- Penanganan rute yang tidak ditemukan (404) ---
app.use((req, res, next) => {
    res.status(404).json({ message: `Route '${req.originalUrl}' not found.` });
});

// --- Global Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err.stack); // Log error stack for debugging
    res.status(500).json({ message: 'Something went wrong on the server.' });
});

// --- PENTING UNTUK VERCEL: Export aplikasi Express ---
// Jangan gunakan app.listen() jika Anda deploy sebagai Serverless Function di Vercel.
// Vercel akan otomatis menangani port.
module.exports = app;

// Kode app.listen hanya untuk pengembangan lokal.
// if (process.env.NODE_ENV !== 'production') {
//     app.listen(PORT, () => {
//         console.log(`Backend server running on http://localhost:${PORT}`);
//     });
// }