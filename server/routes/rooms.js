const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController.js');

// Routes for rooms
router.get('/', roomController.getAllRooms);
router.post('/', roomController.createRoom);
router.get('/:id', roomController.getRoomById);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);
router.get('/:id/assets', roomController.getAssetByRoom);

module.exports = router;
