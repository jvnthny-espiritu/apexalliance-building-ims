const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController.js');

// Routes for rooms
router.get('/', roomController.getAllRooms);
router.post('/', roomController.createRoom);
router.get('/:id', roomController.getRoomById);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

// Route for fetching rooms grouped by floor for a specific building
router.get('/buildings/:id/rooms-by-floor', roomController.getRoomsByBuildingAndFloor);

module.exports = router;
