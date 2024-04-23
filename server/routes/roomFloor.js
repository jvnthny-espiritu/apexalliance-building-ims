const express = require('express');
const router = express.Router();
const Room = require('../models/room');

router.get('/buildings/:id/rooms-by-floor', async (req, res) => {
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
});

module.exports = router;
