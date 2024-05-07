const Campus = require('../models/campus');

module.exports = {
  getAllCampuses: async (req, res) => {
    try {
      const campuses = await Campus.find();
      res.json(campuses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  addCampus: async (req, res) => {
    const { name } = req.body;
    try {
      const campus = await Campus.create({ name });
      res.status(201).json(campus);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getCampusById: async (req, res) => {
    const { id } = req.params;
    try {
      const room = await Campus.findById(id);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      res.json(room);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};