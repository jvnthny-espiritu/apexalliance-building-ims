const express = require('express');
const router = express.Router();
const Building = require('../models/building');
const Room = require('../models/room');
const Asset = require('../models/asset');

router.get('/building-distribution', async (req, res) => {
    try {
        const buildings = await Building.find();
        const buildingDistribution = {};

        buildings.forEach(building => {
            buildingDistribution[building.campus] = (buildingDistribution[building.campus] || 0) + 1;
        });

        res.json(buildingDistribution);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/room-distribution', async (req, res) => {
    try {
        const rooms = await Room.find().populate('buildingId', 'campus');
        const roomDistribution = {};

        rooms.forEach(room => {
            // Check if buildingId is populated and not null before accessing campus
            if (room.buildingId && room.buildingId.campus) {
                const campus = room.buildingId.campus;
                if (!roomDistribution[campus]) {
                    roomDistribution[campus] = {
                        laboratory: 0,
                        classroom: 0,
                        administrative: 0
                    };
                }
                roomDistribution[campus][room.type.toLowerCase()]++;
            }
        });

        res.json(roomDistribution);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/total-assets', async (req, res) => {
    try {
        const totalAssets = await Asset.countDocuments();
        res.json({ totalAssets });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/total-buildings', async (req, res) => {
    try {
        const totalBuildings = await Building.countDocuments();
        res.json({ Buildings: totalBuildings });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/total-rooms', async (req, res) => {
    try {
        const totalRooms = await Room.countDocuments();
        res.json({ Rooms: totalRooms });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
