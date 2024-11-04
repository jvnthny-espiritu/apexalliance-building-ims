const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController.js');
const auditLogger = require('../middleware/auditLogger');

// Routes for rooms
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.get('/:id/assets', roomController.getAssetByRoom);
router.post('/', auditLogger('CREATE'), roomController.createRoom);
router.put('/:id', auditLogger('UPDATE'), roomController.updateRoom);
router.delete('/:id',  auditLogger('DELETE'), roomController.deleteRoom);

module.exports = router;
