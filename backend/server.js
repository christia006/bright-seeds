const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const USERS_DB_PATH = path.join(__dirname, 'data', 'users.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure the data directory exists
async function ensureDataDirectory() {
    const dataDir = path.dirname(USERS_DB_PATH);
    try {
        await fs.mkdir(dataDir, { recursive: true });
    } catch (error) {
        console.error('Error ensuring data directory exists:', error);
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
            await fs.writeFile(USERS_DB_PATH, '[]', 'utf8'); // Create file if it doesn't exist
            return [];
        }
        console.error('Error reading users DB:', error);
        return [];
    }
}

// Helper to write users to the "database"
async function writeUsers(users) {
    await ensureDataDirectory();
    try {
        await fs.writeFile(USERS_DB_PATH, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing users DB:', error);
    }
}

// --- Routes ---

// Register
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const users = await readUsers();

    if (users.find(u => u.username === username)) {
        return res.status(409).json({ message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        username,
        password: hashedPassword,
        progress: {
            reading: {
                letters: [],
                syllables: [],
                sentences: [],
                level: 1
            },
            writing: {
                letters: [],
                words: [],
                sentences: [],
                level: 1
            },
            math: {
                numbers: [],
                counting: [],
                arithmetic: [],
                level: 1
            },
            games: {
                patternScanner: { highscore: 0, level: 'Mudah' },
                memoryTrainer: { highscore: 0, level: 'Mudah' },
                puzzleSyaratGanda: { highscore: 0, level: 'Mudah' },
                kodeRahasia: { highscore: 0, level: 'Mudah' }
            },
            badges: []
        }
    };
    users.push(newUser);
    await writeUsers(users);

    res.status(201).json({ message: 'User registered successfully!' });
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const users = await readUsers();
    const user = users.find(u => u.username === username);

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
    const users = await readUsers();
    const user = users.find(u => u.username === username);

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

    let users = await readUsers();
    const userIndex = users.findIndex(u => u.username === username);

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
    await writeUsers(users);

    const updatedUser = { ...users[userIndex] };
    delete updatedUser.password;

    res.status(200).json({ message: 'Progress updated successfully!', user: updatedUser });
});


// Start server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});