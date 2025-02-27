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

        // Save user suggestion
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

        // Fetch min-max values dynamically for the selected type
        const products = await Product.find({ type: typeOfProducts });

        if (!products.length) {
            return res.render('suggestionResults', { products: [], message: "No products available for this type." });
        }

        // Extract head and flow values
        let headValues = products.map(p => p.head_meters).filter(val => val !== undefined);
        let flowValues = products.map(p => p.discharge_lpm).filter(val => val !== undefined);

        // Calculate min and max dynamically
        const headMin = Math.min(...headValues);
        const headMax = Math.max(...headValues);
        const flowMin = Math.min(...flowValues);
        const flowMax = Math.max(...flowValues);

        console.log(`Min-Max Head: ${headMin} - ${headMax}, Min-Max Flow: ${flowMin} - ${flowMax}`);

        // Parse user input ranges
        let headRange = Head.split("-").map(value => parseFloat(value.trim()));
        let flowRange = Flow.split("-").map(value => parseFloat(value.trim()));

        let userHeadMin = headRange[0] || headMin;
        let userHeadMax = headRange[1] || headMax;
        let userFlowMin = flowRange[0] || flowMin;
        let userFlowMax = flowRange[1] || flowMax;

        // Find products within user's input range
        let matchingProducts = await Product.find({
            type: typeOfProducts,
            head_meters: { $gte: userHeadMin, $lte: userHeadMax },
            discharge_lpm: { $gte: userFlowMin, $lte: userFlowMax }
        });

        // // Fallback: If no exact match, find products matching at least one condition
        // if (matchingProducts.length === 0) {
        //     console.log("No exact match found, searching for alternatives...");
        //     matchingProducts = await Product.find({
        //         $or: [
        //             { type: typeOfProducts },
        //             { head_meters: { $gte: userHeadMin, $lte: userHeadMax } },
        //             { discharge_lpm: { $gte: userFlowMin, $lte: userFlowMax } }
        //         ]
        //     });
        // }

        if (matchingProducts.length === 0) {
            return res.render('suggestionResults', { products: [], message: "No product available within the given range." });
        }

        res.render('suggestionResults', { products: matchingProducts, message: "" });

    } catch (error) {
        console.error("Error in /suggestionForm route:", error);
        res.status(500).send("Please add Min and Max Both Values");
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

        res.render('suggestionResults', { products, message: products.length});
    } catch (error) {
        console.error("Error in /suggestion/results route:", error);
        res.status(500).send("No Product Found");
    }
});



// API to get min-max Head & Flow values for a selected product type
router.get("/get-product-details", async (req, res) => {
    try {
        const productType = req.query.type;
        if (!productType) return res.status(400).json({ error: "Product type is required" });

        // Fetch all products of the given type
        const products = await Product.find({ type: productType });
        console.log(products)

        if (!products.length) return res.status(404).json({ error: "No products found for this type." });

        // Extract head and flow values (flattening arrays)
        let headValues = products.flatMap(p => Array.isArray(p.head_meters) ? p.head_meters.map(Number) : []).filter(val => !isNaN(val));
        let flowValues = products.flatMap(p => Array.isArray(p.discharge_lpm) ? p.discharge_lpm.map(Number) : []).filter(val => !isNaN(val));

        console.log(headValues, flowValues)

        // Handle cases where no valid values exist
        const headMin = headValues.length ? Math.min(...headValues) : null;
        const headMax = headValues.length ? Math.max(...headValues) : null;
        const flowMin = flowValues.length ? Math.min(...flowValues) : null;
        const flowMax = flowValues.length ? Math.max(...flowValues) : null;

        res.json({
            head: { min: headMin, max: headMax },
            flow: { min: flowMin, max: flowMax }
        });

    } catch (error) {
        console.error("Error in /get-product-details API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/suggestion', async (req, res) => {
    try {
        // Fetch all products
        const products = await Product.find({});

        // Fetch distinct product types
        const productTypes = await Product.distinct("type");

        // Render EJS with both data
        res.render('suggestion', { products, productTypes });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Server Error");
    }
});



module.exports = router;
