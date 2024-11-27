const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/export', reportController.exportReport);
router.get('/buildings', reportController.getUniqueBuildingNames);

module.exports = router;
