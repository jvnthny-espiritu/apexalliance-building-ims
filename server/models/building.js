const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  purpose: {
    type: [String],
    required: true
  },
  numFloor: {
    type: Number,
    required: true
  },
  campus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campus',
    required: true
  },
  numOfStory: Number,
  yearOfCompletion: Number
}, { timestamps: true });

const Building = mongoose.model('Building', buildingSchema);

module.exports = Building;
