const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: String,
  quantity: Number,
  serialNumber: String,
  purchaseDate: Date,
  condition: String,
  electricConsumption: Number
}, { timestamps: true });

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
