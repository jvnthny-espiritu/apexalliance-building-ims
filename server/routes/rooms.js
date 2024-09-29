const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController.js');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Routes for rooms
router.get('/', authenticateJWT, authorizeRoles(['admin', 'staff', 'guest']), roomController.getAllRooms);
router.post('/', authenticateJWT, authorizeRoles(['admin', 'staff']), roomController.createRoom);
router.get('/:id', authenticateJWT, authorizeRoles(['admin', 'staff', 'guest']), roomController.getRoomById);
router.put('/:id', authenticateJWT, authorizeRoles(['admin', 'staff']), roomController.updateRoom);
router.delete('/:id', authenticateJWT, authorizeRoles(['admin']), roomController.deleteRoom);
router.get('/:id/assets', authenticateJWT, authorizeRoles(['admin', 'staff', 'guest']), roomController.getAssetByRoom);

module.exports = router;
