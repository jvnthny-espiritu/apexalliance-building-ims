const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/metrics/buildings', dashboardController.getBuildingMetrics);
router.get('/metrics/rooms', dashboardController.getRoomMetrics);
router.get('/metrics/assets', dashboardController.getAssetMetrics);
router.get('/metrics/building-distribution', dashboardController.getBuildingDistribution);
router.get('/metrics/room-distribution', dashboardController.getRoomDistribution);
router.get('/metrics/asset-distribution', dashboardController.getAssetDistribution);

module.exports = router;