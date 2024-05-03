const express = require('express');
const router = express.Router();
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const campusRoutes = require('./routes/campus');
const buildingsRoutes = require('./routes/buildings');
const roomsRoutes = require('./routes/rooms');
const assetsRoutes = require('./routes/assets');
const dashboardRoutes = require('./routes/dashboard');
const filteringRoutes = require('./routes/filtering');
const totalRoomsRoutes = require('./routes/totalRoom'); 

router.use('/', authRoutes);
router.use('/user', usersRoutes);
router.use('/campus', campusRoutes);
router.use('/building', buildingsRoutes);
router.use('/room', roomsRoutes);
router.use('/asset', assetsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/filtering', filteringRoutes);
router.use('/total-rooms', totalRoomsRoutes); 

module.exports = router;
