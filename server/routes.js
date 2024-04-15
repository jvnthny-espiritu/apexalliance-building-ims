const express = require('express');
const router = express.Router();
const usersRoutes = require('./routes/users');
const buildingsRoutes = require('./routes/buildings');
const roomsRoutes = require('./routes/rooms');
const assetsRoutes = require('./routes/assets');
const dashboardRoutes = require('./routes/dashboard');
const filteringRoutes = require('./routes/filtering');

router.use('/users', usersRoutes);
router.use('/buildings', buildingsRoutes);
router.use('/rooms', roomsRoutes);
router.use('/assets', assetsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/filtering', filteringRoutes);

module.exports = router;
