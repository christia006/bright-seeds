// frontend/api/users/[username]/progress.js
const fs = require('fs').promises;
const path = require('path');

const USERS_DB_PATH = path.join(process.cwd(), 'backend', 'data', 'users.json');

async function readUsers() {
    try {
        const data = await fs.readFile(USERS_DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error('Error membaca users DB:', error);
        return [];
    }
}

async function writeUsers(users) {
    try {
        await fs.writeFile(USERS_DB_PATH, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error('Error menulis users DB:', error);
        // Ini adalah error yang akan sering muncul di Vercel karena file system tidak persisten
    }
}

module.exports = async (req, res) => {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Metode tidak diizinkan.' });
    }

    const { username } = req.query; // Parameter dinamis dari URL
    const { progress } = req.body;

    if (!progress) {
        return res.status(400).json({ message: 'Data progres diperlukan.' });
    }

    // --- PENTING: BAGIAN INI TIDAK AKAN BERFUNGSI PERSISTEN DI VERCEL ---
    let users = await readUsers();
    const userIndex = users.findIndex(u => u.username === username);
    // --- AKHIR DARI BAGIAN TIDAK PERSISTEN ---

    if (userIndex === -1) {
        return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    // Merge progress data
    users[userIndex].progress = {
        ...users[userIndex].progress,
        ...progress,
        // Pastikan merge mendalam untuk objek nested
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

    res.status(200).json({ message: 'Progres berhasil diperbarui!', user: updatedUser });
};