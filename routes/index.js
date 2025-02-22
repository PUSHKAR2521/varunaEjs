const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Product Details Page
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.render('product', { product });
    } catch (error) {
        res.status(500).send("Error loading Product page");
    }
});

// Add a review to a product
router.post('/:id/review', async (req, res) => {
    try {
        const { user, rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        const newReview = { user, rating, comment };
        product.reviews.push(newReview);
        await product.save();

        res.redirect(`/product/${req.params.id}`); // Reload the page to show new review
    } catch (error) {
        res.status(500).send("Error submitting review");
    }
});


module.exports = router;
