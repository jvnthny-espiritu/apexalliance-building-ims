const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  name: String,
  type: String,
  quantity: Number,
  serialNumber: String,
  purchaseDate: Date,
  condition: String,
  electricConsumption: Number
}, { timestamps: true });

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
