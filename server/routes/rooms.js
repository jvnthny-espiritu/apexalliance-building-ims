const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController.js');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const auditLogger = require('../middleware/auditLogger');

// Routes for rooms
router.get('/', roomController.getAllRooms);
router.get("/filter", roomController.getFilterOptions);
router.get('/:id', roomController.getRoomById);
router.get('/:id/assets', roomController.getAssetByRoom);
router.post('/', authenticateJWT, authorizeRoles('admin', 'staff'), auditLogger('CREATE'), roomController.createRoom);
router.put('/:id', authenticateJWT, authorizeRoles('admin', 'staff'), auditLogger('UPDATE'), roomController.updateRoom);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'),  auditLogger('DELETE'), roomController.deleteRoom);

module.exports = router;
