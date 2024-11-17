const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const auditLogger = require('../middleware/auditLogger');


// Routes for buildings
router.get('/', buildingController.getAllBuildings);
router.get('/facilities', buildingController.getFacilities);
router.get('/:id', buildingController.getBuildingById);
router.get('/:id/rooms', buildingController.getRoomByFloor);
router.post('/', authenticateJWT, authorizeRoles('admin', 'staff'), auditLogger('CREATE'), buildingController.createBuilding);
router.put('/:id', authenticateJWT, authorizeRoles('admin', 'staff'), auditLogger('UPDATE'), buildingController.updateBuilding);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), auditLogger('DELETE'), buildingController.deleteBuilding);

module.exports = router;
