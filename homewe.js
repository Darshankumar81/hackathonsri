const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory database simulation
const users = [];

// Registration Endpoint
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Check if the email already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user data
    users.push({ email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    const user = users.find((user) => user.email === email);
    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
});

// Home Page Route (For Testing)
app.get('/', (req, res) => {
    res.send('Welcome to the Login Backend!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
