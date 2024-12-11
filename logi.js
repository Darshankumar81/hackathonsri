const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For secure password handling
const cors = require('cors'); // Allow cross-origin requests

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // Handle form submissions
app.use(bodyParser.json()); // Parse JSON bodies

// In-memory database (for simplicity)
const users = [
    {
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10), // Pre-hashed password
    },
];

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user in the database
    const user = users.find((user) => user.username === username);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
});

// Home Route (optional, for testing)
app.get('/', (req, res) => {
    res.send('Welcome to the Login Backend!');
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
