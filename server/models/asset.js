const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Electric', 'Non-electric']
    },
    condition: {
        type: String,
        enum: ['New', 'Good', 'Fair', 'Poor'],
        default: 'Good'
    },
    status: {
        type: String,
        required: true,
        enum: ['Good condition', 'Not working', 'For replacement', 'Under maintenance'],
        default: 'Good condition'
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    purchaseDate: {
        type: Date,
    },
    value: {
        type: Number,
    },
    numberOfUnits: {
        type: Number,
        min: 1
    },
    electricDetails: {
        voltage: Number,
        power: Number,
        manufacturer: String,
        warranty: String,
    },
    nonElectricDetails: {
        material: String,
        dimensions: String,
        weight: Number, 
    }
}, { timestamps: true });

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;