const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: String, required: true },  // User's name or ID
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    model: String,
    motor_rating: String,
    stages: Number,
    head_meters: [Number],
    discharge_lpm: [Number],
    description: String,
    input: String,
    salient_features: [String],
    applications: [String],
    material: String,
    images: [String], 
    motor_details: {
        type: Map,
        of: String
    },
    pump_details: {
        type: Map,
        of: String
    },
    group: String,  // New Fields
    hertz: String,
    suction_size: String,
    delivery_size: String,
    voltage: String,
    power_supply: String,
    type: String,
    reviews: [reviewSchema]  // New Reviews Field
});

module.exports = mongoose.model('Product', productSchema);