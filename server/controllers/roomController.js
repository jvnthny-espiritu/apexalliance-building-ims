const Room = require('../models/room');
const logActivity = require('../middleware/logger');

module.exports = {
  getAllRooms: async (req, res) => {
    try {
      const rooms = await Room.find();
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  createRoom: async (req, res) => {
    const room = new Room({
      buildingId: req.body.buildingId,
      name: req.body.name,
      floor: req.body.floor,
      type: req.body.type,
      capacity: req.body.capacity,
      status: req.body.status
    });

    try {
      const newRoom = await room.save();
      logActivity(req.user.id, 'added a new room', newRoom._id, 'Room');
      res.status(201).json(newRoom);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getRoomById: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json(room);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateRoom: async (req, res) => {
    try {
      const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      } else {
        logActivity(req.user.id, 'updated a new room', newRoom._id, 'Room');
      }
      res.json(room);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  deleteRoom: async (req, res) => {
    try {
      const room = await Room.findByIdAndDelete(req.params.id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      } else {
        logActivity(req.user.id, 'deleted a new room', newRoom._id, 'Room');
      }
      res.json({ message: 'Room deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
