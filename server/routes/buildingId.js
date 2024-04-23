const express = require('express');
const router = express.Router();
const Building = require('../models/building'); // Import the Building model

// Route to get building by ID
router.get('/:id', async (req, res) => {
  try {
    const buildingId = req.params.id;
    const building = await Building.findById(buildingId);
    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }
    res.json(building);
  } catch (error) {
    console.error('Error fetching building by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching building by ID' });
  }
});

module.exports = router;
