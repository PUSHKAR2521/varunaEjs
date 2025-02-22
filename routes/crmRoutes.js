const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');
const User = require('../models/User'); // Import User model
const { authenticateUser, authorizeRole } = require('../middlewares/authMiddleware');

// CRM Dashboard Route (Fetch Suggestions and CE Users)
router.get('/', authenticateUser, authorizeRole('crm'), async (req, res) => {
    try {
        const suggestions = await Suggestion.find().populate('ceAssigned'); // Fetch assigned CE info
        const ceUsers = await User.find({ role: 'ce' }); // Fetch all CE users

        res.render('crm', { suggestions, ceUsers }); // Pass ceUsers to EJS
    } catch (error) {
        console.error('Error fetching suggestions or CE users:', error);
        res.status(500).send('Server Error');
    }
});

 
// Assign Suggestion to Specific CE
router.post('/assign/:id', authenticateUser, authorizeRole('crm'), async (req, res) => {
    try {
        const { ceId } = req.body;
        await Suggestion.findByIdAndUpdate(req.params.id, { sentToCE: true, ceAssigned: ceId });

        res.redirect('/auth/crm'); // Refresh CRM page
    } catch (error) {
        console.error('Error assigning suggestion:', error);
        res.status(500).send('Server Error');
    }
});

// Delete Suggestion
router.post('/delete/:id', authenticateUser, authorizeRole('crm'), async (req, res) => {
    try {
        await Suggestion.findByIdAndDelete(req.params.id);
        res.redirect('/auth/crm'); // Refresh CRM page after deletion
    } catch (error) {
        console.error('Error deleting suggestion:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
