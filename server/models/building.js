const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: String,
  purpose: [String],
  numFloor: Number,
  campus: String,
  numOfStory: Number
}, { timestamps: true });

const Building = mongoose.model('Building', buildingSchema);

module.exports = Building;
