const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');


// Routes for buildings
router.get('/', buildingController.getAllBuildings);
router.post('/', buildingController.createBuilding);
router.get('/:id', buildingController.getBuildingById);
router.put('/:id', buildingController.updateBuilding);
router.delete('/:id', buildingController.deleteBuilding);
router.get('/:id/rooms', buildingController.getRoomByFloor);
router.get('/:id/total-rooms', buildingController.totalRoom);

module.exports = router;
