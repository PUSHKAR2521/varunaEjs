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

module.exports = router;
