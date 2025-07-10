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

async function writeUsers(users) {
  try {
    await fs.writeFile(USERS_DB_PATH, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error menulis users DB:', error);
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Metode tidak diizinkan.' });
  }

  const { username } = req.query;
  const { progress } = req.body;

  if (!progress) {
    return res.status(400).json({ message: 'Data progres diperlukan.' });
  }

  let users = await readUsers();
  const userIndex = users.findIndex(u => u.username === username);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
  }

  users[userIndex].progress = {
    ...users[userIndex].progress,
    ...progress,
    reading: { ...users[userIndex].progress.reading, ...progress.reading },
    writing: { ...users[userIndex].progress.writing, ...progress.writing },
    math: { ...users[userIndex].progress.math, ...progress.math },
    games: { ...users[userIndex].progress.games, ...progress.games }
  };

  await writeUsers(users);

  const updatedUser = { ...users[userIndex] };
  delete updatedUser.password;

  res.status(200).json({ message: 'Progres berhasil diperbarui!', user: updatedUser });
};
