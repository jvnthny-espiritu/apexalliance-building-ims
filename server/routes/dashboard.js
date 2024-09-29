const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');


router.use(authenticateJWT, authorizeRoles(['admin']));

router.get('/building-distribution', dashboardController.getBuildingDistribution);
router.get('/room-distribution', dashboardController.getRoomDistribution);
router.get('/total-assets', dashboardController.getTotalAssets);
router.get('/total-buildings', dashboardController.getTotalBuildings);
router.get('/total-rooms', dashboardController.getTotalRooms);
router.get('/activity-log', dashboardController.getActivityLog);

module.exports = router;
