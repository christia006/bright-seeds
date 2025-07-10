const fs = require('fs').promises;
const path = require('path');

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
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Metode tidak diizinkan.' });
  }

  const { username } = req.query;

  const users = await readUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
  }

  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;

  res.status(200).json({ user: userWithoutPassword });
};
