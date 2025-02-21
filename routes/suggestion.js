const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');
const Product = require('../models/Product'); // Assuming you have a Product model
const { authenticateUser, authorizeRole } = require('../middlewares/authMiddleware');

// Route to handle suggestion form submission
router.post('/suggestionForm', async (req, res) => {
    try {
        const newSuggestion = new Suggestion({
            name: req.body.Name,
            mobileNo: req.body["Mobile-No"],
            email: req.body.Email,
            state: req.body.State,
            city: req.body.City,
            district: req.body.District,
            businessType: req.body["Buisness-Type"],
            findForm: req.body["find-form"],
            typeOfProducts: req.body["Type-Of-Products"],
            head: req.body.Head,
            flow: req.body.Flow,
            pipeSize: req.body["pipe-size"],
            phase: req.body.Phase,
            frequency: req.body.Frequency
        });

        await newSuggestion.save();
        console.log(req.body);


        // Find a matching product based on the suggested type
        const product = await Product.findOne({ type: req.body["Type-Of-Products"] });

        // Redirect to results page, passing product ID if found
        res.redirect(`/suggestion/results?productId=${product ? product._id : ''}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Route to display suggested product to the user
router.get('/suggestion/results', async (req, res) => {
    try {
        const product = await Product.findById(req.query.productId);
        res.render('suggestionResults', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading suggestions");
    }
});

// Route to show suggestions in CRM dashboard
router.get('/crm/suggestions', authenticateUser, authorizeRole(["crm"]), async (req, res) => {
    try {
        const suggestions = await Suggestion.find();
        res.render('crmDashboard', { suggestions });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
