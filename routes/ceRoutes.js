const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');
const { authenticateUser, authorizeRole } = require('../middlewares/authMiddleware');

// 📌 CE Dashboard - View Assigned Suggestions
router.get('/', authenticateUser, authorizeRole('ce'), async (req, res) => {
    console.log("Session User:", req.session.user); // Debugging

    if (!req.session.user) {
        return res.status(401).send("Session expired. Please log in again.");
    }
    
    try {
        const ceId = req.session.user.id; // Get CE ID from session
        const suggestions = await Suggestion.find({ ceAssigned: ceId }); // Fetch only assigned suggestions
        res.render('ce', { suggestions });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).send('Server Error');
    }
});

// ✅ Update Completion Status
router.post("/update-status/:id", authenticateUser, authorizeRole('ce'), async (req, res) => {
    try {
        const { completed } = req.body;
        await Suggestion.findByIdAndUpdate(req.params.id, { completed });
        res.redirect('/auth/ce');
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// ❌ Delete Assigned Suggestion (Only CE Can Delete Their Own Suggestions)
router.post('/delete/:id', authenticateUser, authorizeRole('ce'), async (req, res) => {
    try {
        const suggestion = await Suggestion.findById(req.params.id);
        
        // Ensure CE can only delete their own assigned suggestions
        if (!suggestion || suggestion.ceAssigned.toString() !== req.session.user.id) {
            return res.status(403).send("Unauthorized: You can only delete your assigned suggestions.");
        }

        await Suggestion.findByIdAndDelete(req.params.id);
        res.redirect('/auth/ce');
    } catch (error) {
        console.error('Error deleting suggestion:', error);
        res.status(500).send('Server Error');
    }
});

// ✉️ Send Message
router.post('/send-message/:id', authenticateUser, authorizeRole('ce'), async (req, res) => {
    try {
        const { message } = req.body;
        await Suggestion.findByIdAndUpdate(req.params.id, { message });
        res.redirect('/auth/ce'); // Redirect back to the CE dashboard
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).send('Server Error');
    }
});

// 📝 Edit Message
router.post('/edit-message/:id', authenticateUser, authorizeRole('ce'), async (req, res) => {
    try {
        const { message } = req.body;
        await Suggestion.findByIdAndUpdate(req.params.id, { message });
        res.redirect('/auth/ce');
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).send('Server Error');
    }
});

// 🗑 Delete Message
router.post('/delete-message/:id', authenticateUser, authorizeRole('ce'), async (req, res) => {
    try {
        await Suggestion.findByIdAndUpdate(req.params.id, { message: null });
        res.redirect('/auth/ce');
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
