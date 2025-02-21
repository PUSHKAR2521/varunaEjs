const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middlewares/authMiddleware');

// Show Admin Panel
router.get('/', authMiddleware, async (req, res) => {
    const products = await Product.find();
    res.render('admin', { products });
});

// Add Product
router.post('/add', authMiddleware, async (req, res) => {
    const { model, motor_rating, head_meters, discharge_lpm, input, stages, description, salient_features, applications, material } = req.body;
    await Product.create({
        model,
        motor_rating,
        head_meters: head_meters.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num)),
        discharge_lpm: discharge_lpm.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num)),
        input,
        stages,
        description,
        salient_features: salient_features.split(','),
        applications: applications.split(','),
        material });
    res.redirect('/admin');
});

// Show Edit Page
router.get('/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.render('edit', { product });
    } catch (error) {
        res.status(500).send("Error loading edit page");
    }
});

// Handle Product Update
router.post('/update/:id', async (req, res) => {
    try {
        const { model, motor_rating, stages, head_meters, discharge_lpm, input, material, description, salient_features, applications } = req.body;

        await Product.findByIdAndUpdate(req.params.id, {
            model,
            motor_rating,
            stages,
            head_meters: head_meters.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num)),
            discharge_lpm: discharge_lpm.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num)),
            input,
            material,
            description,
            salient_features: salient_features.split(',').map(item => item.trim()),
            applications: applications.split(',').map(item => item.trim())
        });

        res.redirect('/admin');
    } catch (error) {
        res.status(500).send("Error updating product");
    }
});

// Handle Product Deletion
router.get('/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (error) {
        res.status(500).send("Error deleting product");
    }
});


module.exports = router;
