const Building = require('../models/building');
const Room = require('../models/room');
const logActivity = require('../middleware/logger');

module.exports = {
  getAllBuildings: async (req, res) => {
    try {
      const { purpose, campus } = req.query;
      let query = {};
      if (purpose) {
        query.purpose = { $in: [purpose] };
      }
      if (campus) {
        query.campus = campus;
      }
      const buildings = await Building.find(query).populate('campus', 'name');
      res.json(buildings);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  
  createBuilding: async (req, res) => {
    const { name, purpose, numFloor, campus, numOfStory, yearOfCompletion } = req.body;
    
    try {
      const newBuilding = await Building.create({ name, purpose, numFloor, campus, numOfStory, yearOfCompletion });
      logActivity(req.user.id, 'added a new building', newBuilding._id, 'Building');
      res.status(201).json(newBuilding);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  
  getBuildingById: async (req, res) => {
    const { id } = req.params;
    
    try {
      const building = await Building.findById(id);
      if (!building) {
        return res.status(404).json({ error: 'Building not found' });
      }
      res.json(building);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  
  updateBuilding: async (req, res) => {
    const { id } = req.params;
    
    try {
      const updatedBuilding = await Building.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedBuilding) {
        return res.status(404).json({ error: 'Building not found' });
      }
      logActivity(req.user.id, 'updated a building', updatedBuilding._id, 'Building');
      res.json(updatedBuilding);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  
  deleteBuilding: async (req, res) => {
    const { id } = req.params;
    
    try {
      const deletedBuilding = await Building.findByIdAndDelete(id);
      if (!deletedBuilding) {
        return res.status(404).json({ error: 'Building not found' });
      }
      logActivity(req.user.id, 'deleted a building', deletedBuilding._id, 'Building');
      res.json({ message: 'Building deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getRoomByFloor: async (req, res) => {
    const building = req.params.id;
    try {
      if (!building) {
        return res.status(400).json({ error: 'Building ID is required' });
      }
      const rooms = await Room.find({ building });
      const roomsByFloor = rooms.reduce((acc, room) => {
        const floor = room.floor;
        if (!acc[floor]) {
          acc[floor] = [];
        }
        acc[floor].push(room);
        return acc;
      }, {});
      res.json(roomsByFloor);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).json({ error: 'An error occurred while fetching rooms' });
    }
  },
  totalRoom: async (req, res) => {
    try {
      const buildingId = req.params.id;
      const totalRooms = await Room.countDocuments({ "building": buildingId });
      res.json({ totalRooms });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
