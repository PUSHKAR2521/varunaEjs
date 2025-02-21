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
router.post('/add', async (req, res) => {
    try {
        const newProduct = new Product({
            model: req.body.model,
            motor_rating: req.body.motor_rating,
            stages: req.body.stages,
            head_meters: req.body.head_meters.split(",").map(num => parseFloat(num.trim())),
            discharge_lpm: req.body.discharge_lpm.split(",").map(num => parseFloat(num.trim())),
            description: req.body.description,
            input: req.body.input,
            salient_features: req.body.salient_features.split(",").map(str => str.trim()),
            applications: req.body.applications.split(",").map(str => str.trim()),
            material: req.body.material,
            images: req.body.images ? req.body.images.split(",") : [],
            motor_details: req.body.motor_details,
            pump_details: req.body.pump_details,
            group: req.body.group,
            hertz: req.body.hertz,
            suction_size: req.body.suction_size,
            delivery_size: req.body.delivery_size,
            voltage: req.body.voltage,
            power_supply: req.body.power_supply,
            type: req.body.type
        });

        await newProduct.save();
        res.redirect('/admin');
    } catch (error) {
        res.status(500).send("Error adding product");
    }
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
router.post('/edit/:id', async (req, res) => {
    try {
        const updatedProduct = {
            model: req.body.model,
            motor_rating: req.body.motor_rating,
            stages: req.body.stages,
            head_meters: req.body.head_meters.split(",").map(num => parseFloat(num.trim())),
            discharge_lpm: req.body.discharge_lpm.split(",").map(num => parseFloat(num.trim())),
            description: req.body.description,
            input: req.body.input,
            salient_features: req.body.salient_features.split(",").map(str => str.trim()),
            applications: req.body.applications.split(",").map(str => str.trim()),
            material: req.body.material,
            images: req.body.images ? req.body.images.split(",") : [],
            motor_details: req.body.motor_details,
            pump_details: req.body.pump_details,
            group: req.body.group,
            hertz: req.body.hertz,
            suction_size: req.body.suction_size,
            delivery_size: req.body.delivery_size,
            voltage: req.body.voltage,
            power_supply: req.body.power_supply,
            type: req.body.type
        };

        await Product.findByIdAndUpdate(req.params.id, updatedProduct);
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