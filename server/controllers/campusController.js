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
      const campus = new Campus({ name });
      await campus.save();
      res.status(201).json(campus);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};