const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');
const { authenticateUser, authorizeRole } = require('../middlewares/authMiddleware');

// CRM Dashboard Route (Fetch Suggestions)
router.get('/', authenticateUser, authorizeRole('crm'), async (req, res) => {
    try {
        const suggestions = await Suggestion.find();
        res.render('crm', { suggestions });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).send('Server Error');
    }
});

// Send Suggestion to CE
router.post('/send/:id', authenticateUser, authorizeRole('crm'), async (req, res) => {
    try {
        await Suggestion.findByIdAndUpdate(req.params.id, { sentToCE: true });
        res.redirect('/auth/crm'); // Refresh CRM page
    } catch (error) {
        console.error('Error sending suggestion:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
