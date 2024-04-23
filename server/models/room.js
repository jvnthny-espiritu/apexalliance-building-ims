const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  name: String,
  floor: Number,
  type: String,
  capacity: Number,
  status: String,
  dimension: String,
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
