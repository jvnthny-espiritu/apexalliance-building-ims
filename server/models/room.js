const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  type: String,
  capacity: Number,
  status: String,
  dimension: String,
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
