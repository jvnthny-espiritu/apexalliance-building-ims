const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');
const auditLogger = require('../middleware/auditLogger');


// Routes for buildings
router.get('/', buildingController.getAllBuildings);
router.get('/facilities', buildingController.getFacilities);
router.get('/:id', buildingController.getBuildingById);
router.get('/:id/rooms', buildingController.getRoomByFloor);
router.post('/', auditLogger('CREATE'), buildingController.createBuilding);
router.put('/:id', auditLogger('UPDATE'), buildingController.updateBuilding);
router.delete('/:id', auditLogger('DELETE'), buildingController.deleteBuilding);

module.exports = router;
