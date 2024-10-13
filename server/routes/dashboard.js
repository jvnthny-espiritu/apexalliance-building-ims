const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/metrics/all', dashboardController.getAllMetrics);
router.get('/metrics/building-distribution', dashboardController.getBuildingDistribution);
router.get('/metrics/room-distribution', dashboardController.getRoomDistribution);
router.get('/metrics/asset-distribution', dashboardController.getAssetDistribution);

module.exports = router;