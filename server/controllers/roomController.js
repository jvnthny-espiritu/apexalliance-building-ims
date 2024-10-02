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
    const { building, name, floor, purpose, status } = req.body;
    try {
      const newRoom = await Room.create({ building, name, floor, purpose, status });
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

        const deleteResult = await Asset.deleteMany({ location: id });
        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ message: 'Room deleted, but no related assets were found.' });
        }
        if (req.user && req.user.id) {
            logActivity(req.user.id, 'deleted a room', deletedRoom._id, 'Room');
        } else {
            console.error('User not found for logging activity');
        }

        res.json({ message: `Room and ${deleteResult.deletedCount} related assets deleted` });
    } catch (err) {
        console.error('Error deleting room or assets:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getAssetByRoom: async (req, res) => {
    try {
      const roomId = req.params.id;
      const { category, condition, date } = req.query;
      const query = { location: roomId };

      if (category) {
        query.category = category;
      }
      if (condition) {
        query.condition = condition;
      }
      if (date) {
        const dateObject = new Date(date);
        const nextDay = new Date(dateObject);
        nextDay.setDate(dateObject.getDate() + 1);
        query.createdAt = {
          $gte: dateObject,
          $lt: nextDay
        };
      }

      const assets = await Asset.find(query).populate('location', 'name'); 

      res.json(assets);
    } catch (error) {
      console.error('Error fetching assets:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
