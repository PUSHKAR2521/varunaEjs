const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');
const { authenticateUser, authorizeRole } = require('../middlewares/authMiddleware');

// CE Dashboard - Only view sent suggestions
router.get('/', authenticateUser, authorizeRole('ce'), async (req, res) => {
    try {
        const suggestions = await Suggestion.find({ sentToCE: true }); // Only fetch sent suggestions
        res.render('ce', { suggestions });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).send('Server Error');
    }
});

// Update completion status
router.post("/update-status/:id", async (req, res) => {
    try {
        const { completed } = req.body;
        await Suggestion.findByIdAndUpdate(req.params.id, { completed });

        res.redirect('/auth/ce');
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Server Error" });
    }
});

module.exports = router;
