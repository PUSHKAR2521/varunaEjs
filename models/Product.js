const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    input: String,
    salient_features: [String],
    applications: [String],
    material: String,
    model: String,
    motor_rating: String,
    stages: Number,
    head_meters: [Number],
    discharge_lpm: [Number],
});

module.exports = mongoose.model('Product', productSchema);
