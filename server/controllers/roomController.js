const Room = require('../models/room');
const logActivity = require('../middleware/logger');

module.exports = {
  getAllRooms: async (req, res) => {
    try {
      const rooms = await Room.find();
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

  getRoomsByBuildingAndFloor: async (req, res) => {
    try {
      // Validate buildingId parameter
      const buildingId = req.params.id;
      if (!buildingId) {
        return res.status(400).json({ error: 'Building ID is required' });
      }

      // Fetch rooms by building ID
      const rooms = await Room.find({ buildingId });

      // Group rooms by floor
      const floors = rooms.reduce((acc, room) => {
        if (!acc[room.floor]) {
          acc[room.floor] = { buildingFloor: room.floor, rooms: [] };
        }
        acc[room.floor].rooms.push(room);
        return acc;
      }, {});

      const floorsArray = Object.values(floors);

      // Return floors data
      res.json(floorsArray);
    } catch (error) {
      console.error('Error fetching floors by building:', error);
      res.status(500).json({ error: 'An error occurred while fetching floors by building' });
    }
  }
};
