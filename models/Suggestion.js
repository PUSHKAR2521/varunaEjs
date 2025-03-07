const mongoose = require('mongoose');

const SuggestionSchema = new mongoose.Schema({
    name: String,
    mobileNo: String,
    email: String,
    state: String,
    city: String,
    district: String,
    businessType: String,
    findForm: String,
    typeOfProducts: String,
    head: String,
    flow: String,
    pipeSize: String,
    phase: String,
    frequency: String,
    createdAt: { type: Date, default: Date.now },
    sentToCE: { type: Boolean, default: false },
    ceAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    completed: { type: Boolean, default: false },
    message: { type: String, default: "" }  // ✅ New field for messages
});

module.exports = mongoose.model('Suggestion', SuggestionSchema);
