const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => {
    res.render('loginMain');
});

// Handle Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Destroy existing session if another user is logged in
        if (req.session.user) {
            console.log(`Logging out existing user: ${req.session.user.role}`);
            req.session.destroy(() => {
                req.session = null; // Ensure session is reset
            });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.send("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send("Invalid credentials");
        }

        // Store user session
        req.session.user = {
            id: user._id,
            role: user.role
        };

        // Redirect based on role
        switch (user.role) {
            case 'admin': return res.redirect('/admin');
            case 'crm': return res.redirect('/auth/crm');
            case 'ce': return res.redirect('/auth/ce');
            default: return res.redirect('/user-dashboard');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;
