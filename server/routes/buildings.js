const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Routes for buildings
router.get('/', authenticateJWT, authorizeRoles(['admin', 'staff', 'guest']), buildingController.getAllBuildings);
router.post('/', authenticateJWT, authorizeRoles(['admin', 'staff']), buildingController.createBuilding);
router.get('/:id', authenticateJWT, authorizeRoles(['admin', 'staff', 'guest']), buildingController.getBuildingById);
router.put('/:id', authenticateJWT, authorizeRoles(['admin', 'staff']), buildingController.updateBuilding);
router.delete('/:id', authenticateJWT, authorizeRoles(['admin']), buildingController.deleteBuilding);
router.get('/:id/rooms', authenticateJWT, authorizeRoles(['admin', 'staff', 'guest']), buildingController.getRoomByFloor);
router.get('/:id/total-rooms', authenticateJWT, authorizeRoles(['admin', 'staff', 'guest']), buildingController.totalRoom);

module.exports = router;
