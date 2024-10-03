const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/metrics/assets', dashboardController.getAssetMetrics);
router.get('/metrics/buildings', dashboardController.getBuildingMetrics);
router.get('/metrics/rooms', dashboardController.getRoomMetrics);
router.get('/activity-log', dashboardController.getActivityLog);

module.exports = router;