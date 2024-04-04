const Building = require('../models/building');

module.exports = {
  getAllBuildings: async (req, res) => {
    try {
      const buildings = await Building.find();
      res.json(buildings);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  createBuilding: async (req, res) => {
    const building = new Building({
      name: req.body.name,
      purpose: req.body.purpose,
      campus: req.body.campus,
      numOfStory: req.body.numOfStory
    });

    try {
      const newBuilding = await building.save();
      res.status(201).json(newBuilding);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getBuildingById: async (req, res) => {
    try {
      const building = await Building.findById(req.params.id);
      if (!building) {
        return res.status(404).json({ message: 'Building not found' });
      }
      res.json(building);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateBuilding: async (req, res) => {
    try {
      const building = await Building.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!building) {
        return res.status(404).json({ message: 'Building not found' });
      }
      res.json(building);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  deleteBuilding: async (req, res) => {
    try {
      const building = await Building.findByIdAndDelete(req.params.id);
      if (!building) {
        return res.status(404).json({ message: 'Building not found' });
      }
      res.json({ message: 'Building deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
