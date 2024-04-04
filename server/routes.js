const express = require('express');
const router = express.Router();
// const usersRoutes = require('./routes/users');
const buildingsRoutes = require('./routes/buildings');
const roomsRoutes = require('./routes/rooms');
const assetsRoutes = require('./routes/assets');

// router.use('/users', usersRoutes);
router.use('/buildings', buildingsRoutes);
router.use('/rooms', roomsRoutes);
router.use('/assets', assetsRoutes);

module.exports = router;
