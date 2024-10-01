const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

router.get('/export', reportController.exportReport);

module.exports = router;
