const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/metrics/assets', dashboardController.getAssetMetrics);
router.get('/metrics/buildings', dashboardController.getBuildingMetrics);
router.get('/metrics/rooms', dashboardController.getRoomMetrics);
router.get('/building-distribution', dashboardController.getBuildingDistribution);
router.get('/room-distribution', dashboardController.getRoomDistribution);
router.get('/total-assets', dashboardController.getTotalAssets);
router.get('/total-buildings', dashboardController.getTotalBuildings);
router.get('/total-rooms', dashboardController.getTotalRooms);
router.get('/activity-log', dashboardController.getActivityLog);

module.exports = router;