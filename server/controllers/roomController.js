const Room = require('../models/room');
const Asset = require('../models/asset');
const logActivity = require('../middleware/logger');

module.exports = {
  getAllRooms: async (req, res) => {
    try {
      const rooms = await Room.find();
      console.log(rooms);
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createRoom: async (req, res) => {
    const { buildingId, name, floor, type, capacity, status } = req.body;

    try {
      const newRoom = await Room.create({ buildingId, name, floor, type, capacity, status });
      logActivity(req.user.id, 'added a new room', newRoom._id, 'Room');
      res.status(201).json(newRoom);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  getRoomById: async (req, res) => {
    const { id } = req.params;

    try {
      const room = await Room.findById(id);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      res.json(room);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateRoom: async (req, res) => {
    const { id } = req.params;

    try {
      const updatedRoom = await Room.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedRoom) {
        return res.status(404).json({ error: 'Room not found' });
      }
      logActivity(req.user.id, 'updated a room', updatedRoom._id, 'Room');
      res.json(updatedRoom);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  deleteRoom: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedRoom = await Room.findByIdAndDelete(id);
      if (!deletedRoom) {
        return res.status(404).json({ error: 'Room not found' });
      }
      logActivity(req.user.id, 'deleted a room', deletedRoom._id, 'Room');
      res.json({ message: 'Room deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getAssetByRoom: async (req, res) => {
    const room = req.params.id;
    try {
      if (!room) {
        return res.status(400).json({ error: 'Room ID is required' });
      }
        const assets = await Asset.find({ room });
        res.json(assets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
