const express = require('express');
const router = express.Router();
const usersRoutes = require('./routes/users');
const buildingsRoutes = require('./routes/buildings');
const roomsRoutes = require('./routes/rooms');
const assetsRoutes = require('./routes/assets');
const dashboardRoutes = require('./routes/dashboard');
const filteringRoutes = require('./routes/filtering');
const totalRoomsRoutes = require('./routes/totalRoom'); 
const roomsFloorRoutes = require('./routes/roomFloor');
const buildingByIdRoutes = require('./routes/buildingId');
const authRoutes = require('./routes/auth');

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/buildings', buildingsRoutes);
router.use('/rooms', roomsRoutes);
router.use('/assets', assetsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/filtering', filteringRoutes);
router.use('/total-rooms', totalRoomsRoutes); 
router.use('/room-floor', roomsFloorRoutes);
router.use('/buildings-by-id', buildingByIdRoutes); // Add the new route for fetching buildings by ID

module.exports = router;
