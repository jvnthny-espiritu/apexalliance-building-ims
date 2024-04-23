const express = require('express');
const router = express.Router();
const Room = require('../models/room');

router.get('/:id', async (req, res) => {
  try {
    const buildingId = req.params.id;
    const totalRooms = await Room.countDocuments({ buildingId });
    res.json({ totalRooms });
  } catch (error) {
    console.error('Error fetching total rooms:', error);
    res.status(500).json({ error: 'An error occurred while fetching total rooms' });
  }
});

module.exports = router;
