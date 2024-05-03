const Building = require('../models/building');
const logActivity = require('../middleware/logger');

module.exports = {
  getAllBuildings: async (req, res) => {
    try {
      const buildings = await Building.find();
      res.json(buildings);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  
  createBuilding: async (req, res) => {
    const { name, purpose, campus, numOfStory } = req.body;
    
    try {
      const newBuilding = await Building.create({ name, purpose, campus, numOfStory });
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
  }
};
