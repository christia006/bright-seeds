const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_DB_PATH = path.join(process.cwd(), 'backend', 'data', 'users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error membaca users DB:', error);
    return [];
  }
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Metode tidak diizinkan.' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Nama pengguna dan kata sandi diperlukan.' });
    }

    const users = await readUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(400).json({ message: 'Nama pengguna atau kata sandi tidak valid.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Nama pengguna atau kata sandi tidak valid.' });
    }

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    return res.status(200).json({ message: 'Login berhasil!', user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};
