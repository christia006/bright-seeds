import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const USERS_DB_PATH = path.join(process.cwd(), 'backend', 'data', 'users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(USERS_DB_PATH, '[]', 'utf8');
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
  }
}

export default async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Metode tidak diizinkan.' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Nama pengguna dan kata sandi diperlukan.' });
    }

    const users = await readUsers();
    if (users.find(u => u.username === username)) {
      return res.status(409).json({ message: 'Nama pengguna sudah ada.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      password: hashedPassword,
      progress: {
        reading: { letters: [], syllables: [], sentences: [], level: 1 },
        writing: { letters: [], words: [], sentences: [], level: 1 },
        math: { numbers: [], counting: [], arithmetic: [], level: 1 },
        games: {
          patternScanner: { highscore: 0, level: "Mudah" },
          memoryTrainer: { highscore: 0, level: "Mudah" },
          puzzleSyaratGanda: { highscore: 0, level: "Mudah" },
          kodeRahasia: { highscore: 0, level: "Mudah" }
        },
        badges: []
      }
    };

    users.push(newUser);
    await writeUsers(users);

    return res.status(201).json({ message: 'Pengguna berhasil terdaftar!' });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};
