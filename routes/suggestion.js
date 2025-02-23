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

        let matchingProducts = [];

        if (headValue !== null && flowValue !== null && typeOfProducts) {
            // Find products that match all three values
            matchingProducts = await Product.find({
                type: typeOfProducts,
                head_meters: { $gte: headValue - 5, $lte: headValue + 5 }, // ±5 deviation
                discharge_lpm: { $gte: flowValue - 10, $lte: flowValue + 10 } // ±10 deviation
            });

            // If no exact match, find products matching at least one input
            if (matchingProducts.length === 0) {
                console.log("No exact match found, searching for alternatives...");
                matchingProducts = await Product.find({
                    $or: [
                        { type: typeOfProducts },
                        { head_meters: { $gte: headValue - 5, $lte: headValue + 5 } },
                        { discharge_lpm: { $gte: flowValue - 10, $lte: flowValue + 10 } }
                    ]
                });
            }
        }

        if (matchingProducts.length === 0) {
            return res.render('suggestionResults', { products: [], message: "Product not available." });
        }

        res.render('suggestionResults', { products: matchingProducts, message: "" });

    } catch (error) {
        console.error("Error in /suggestionForm route:", error);
        res.status(500).send("Server Error");
    }
});

// Route to display results
router.get('/suggestion/results', async (req, res) => {
    try {
        let products = [];

        if (req.query.productId) {
            let product = await Product.findById(req.query.productId);
            if (product) {
                products.push(product);
            }
        }

        if (products.length === 0) {
            products = await Product.find(); // Show all products if no match found
        }

        res.render('suggestionResults', { products, message: products.length ? "" : "No exact match found." });
    } catch (error) {
        console.error("Error in /suggestion/results route:", error);
        res.status(500).send("No Product Found");
    }
});

module.exports = router;
