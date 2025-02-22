// const express = require('express');
// const router = express.Router();
// const Suggestion = require('../models/Suggestion');
// const Product = require('../models/Product'); 
// const { authenticateUser, authorizeRole } = require('../middlewares/authMiddleware');

// // Route to handle suggestion form submission
// router.post('/suggestionForm', async (req, res) => {
//     try {
//         // Extracting input values
//         const {
//             Name,
//             ["Mobile-No"]: mobileNo,
//             Email: email,
//             State: state,
//             City: city,
//             District: district,
//             ["Buisness-Type"]: businessType,
//             ["find-form"]: findForm,
//             Model,
//             ["Type-Of-Products"]: typeOfProducts,
//             Head,
//             Flow,
//             ["pipe-size"]: pipeSize,
//             Phase: phase,
//             Frequency: frequency
//         } = req.body;

//         // Save user suggestion in MongoDB
//         const newSuggestion = new Suggestion({
//             name: Name,
//             mobileNo,
//             email,
//             state,
//             city,
//             district,
//             businessType,
//             findForm,
//             model: Model,
//             typeOfProducts,
//             head: Head,
//             flow: Flow,
//             pipeSize,
//             phase,
//             frequency
//         });

//         await newSuggestion.save();
//         console.log("Suggestion Saved:", req.body);

//         // Convert Head & Flow to numbers
//         const headValue = parseFloat(Head);
//         const flowValue = parseFloat(Flow);

//         // Query MongoDB to find a matching product
//         const product = await Product.findOne({
//             model: Model,
//             type: typeOfProducts,               // Match product type
//             head_meters: { $in: [headValue] },  // Check if head exists in the array
//             discharge_lpm: { $in: [flowValue] } // Check if flow exists in the array
//         });

//         if (!product) {
//             console.log("No matching product found.");
//         } else {
//             console.log("Matching product found:", product.model);
//         }

//         // Redirect to results page, passing product ID if found
//         res.redirect(`/suggestion/results?productId=${product ? product._id : ''}`);
//     } catch (error) {
//         console.error("Error in /suggestionForm route:", error);
//         res.status(500).send("Server Error");
//     }
// });

// // Route to display suggested product to the user
// router.get('/suggestion/results', async (req, res) => {
//     try {
//         const product = await Product.findById(req.query.productId);

//         if (!product) {
//             return res.render('suggestionResults', { product: null, message: "No product found matching the criteria." });
//         }

//         res.render('suggestionResults', { product, message: "" });
//     } catch (error) {
//         console.error("Error in /suggestion/results route:", error);
//         res.status(500).send("No Product Found");
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');
const Product = require('../models/Product');

// Route to handle suggestion form submission
router.post('/suggestionForm', async (req, res) => {
    try {
        // Extracting input values
        const {
            Name,
            ["Mobile-No"]: mobileNo,
            Email: email,
            State: state,
            City: city,
            District: district,
            ["Buisness-Type"]: businessType,
            ["find-form"]: findForm,
            Model,
            ["Type-Of-Products"]: typeOfProducts,
            Head,
            Flow,
            ["pipe-size"]: pipeSize,
            Phase: phase,
            Frequency: frequency
        } = req.body;

        // Save user suggestion in MongoDB
        const newSuggestion = new Suggestion({
            name: Name,
            mobileNo,
            email,
            state,
            city,
            district,
            businessType,
            findForm,
            model: Model,
            typeOfProducts,
            head: Head,
            flow: Flow,
            pipeSize,
            phase,
            frequency
        });

        await newSuggestion.save();
        console.log("Suggestion Saved:", req.body);

        // Convert Head & Flow to numbers
        const headValue = Head ? parseFloat(Head) : null;
        const flowValue = Flow ? parseFloat(Flow) : null;

        let product = null;

        if (headValue !== null && flowValue !== null && typeOfProducts) {
            // Search for a specific product if all three values are provided
            product = await Product.findOne({
                type: typeOfProducts,
                head_meters: { $gte: headValue - 5, $lte: headValue + 5 }, // ±5 deviation
                discharge_lpm: { $gte: flowValue - 10, $lte: flowValue + 10 } // ±10 deviation
            });

            if (!product) {
                console.log("No exact match found, searching for alternatives...");
                
                // If no exact match, find a product that matches at least one of the inputs
                product = await Product.findOne({
                    $or: [
                        { type: typeOfProducts },
                        { head_meters: { $gte: headValue - 5, $lte: headValue + 5 } },
                        { discharge_lpm: { $gte: flowValue - 10, $lte: flowValue + 10 } }
                    ]
                });
            }
        }

        if (!product) {
            console.log("No matching product found.");
        } else {
            console.log("Matching product found:", product.model);
        }

        // Redirect to results page, passing product ID if found
        res.redirect(`/suggestion/results?productId=${product ? product._id : ''}`);
    } catch (error) {
        console.error("Error in /suggestionForm route:", error);
        res.status(500).send("Server Error");
    }
});

// Route to display suggested product or all products
router.get('/suggestion/results', async (req, res) => {
    try {
        let product = null;
        let allProducts = await Product.find(); // Fetch all products

        if (req.query.productId) {
            product = await Product.findById(req.query.productId);
        }

        res.render('suggestionResults', { 
            product, 
            allProducts, 
            message: product ? "" : "No exact match found. Here are all available products." 
        });
    } catch (error) {
        console.error("Error in /suggestion/results route:", error);
        res.status(500).send("No Product Found");
    }
});

// Route to display all products on a separate page
router.get('/all-products', async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.render('allProducts', { allProducts });
    } catch (error) {
        console.error("Error fetching all products:", error);
        res.status(500).send("Error fetching products");
    }
});

module.exports = router;
