const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');
const { authenticateUser, authorizeRole } = require('../middlewares/authMiddleware');

// CE Dashboard - Only view suggestions assigned to the logged-in CE
router.get('/', authenticateUser, authorizeRole('ce'), async (req, res) => {
    console.log("Session User:", req.session.user); // Debugging


    if (!req.session.user) {
        return res.status(401).send("Session expired. Please log in again.");
    }
    try {
        const ceId = req.session.user.id; // Ensure 'id' exists in session
        const suggestions = await Suggestion.find({ ceAssigned: ceId }); // Fetch only assigned suggestions
        res.render('ce', { suggestions });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).send('Server Error');
    }
});

// Update completion status
router.post("/update-status/:id", authenticateUser, authorizeRole('ce'), async (req, res) => {
    try {
        const { completed } = req.body;
        await Suggestion.findByIdAndUpdate(req.params.id, { completed });
        res.redirect('/auth/ce');
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Server Error" });
    }
});

// Delete assigned suggestion (only CE can delete their own assigned suggestions)
router.post('/delete/:id', authenticateUser, authorizeRole('ce'), async (req, res) => {
    try {
        const suggestion = await Suggestion.findById(req.params.id);
        
        // Ensure CE can only delete their own assigned suggestion
        if (suggestion.ceAssigned.toString() !== req.user._id.toString()) {
            return res.status(403).send("Unauthorized: You can only delete your assigned suggestions.");
        }

        await Suggestion.findByIdAndDelete(req.params.id);
        res.redirect('/auth/ce');
    } catch (error) {
        console.error('Error deleting suggestion:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
