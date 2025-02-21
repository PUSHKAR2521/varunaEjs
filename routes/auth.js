const express = require('express');
const router = express.Router();

const users = [{ username: "a", password: "a" }]; // Example, replace with DB storage

// Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user;
        return res.redirect('/admin');
    }
    res.send("Invalid credentials");
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;
