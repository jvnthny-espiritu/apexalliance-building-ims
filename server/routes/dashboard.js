const express = require('express');
const axios = require('axios');
const router = express.Router();
const Building = require('../models/building');
const Room = require('../models/room');
const Asset = require('../models/asset');

router.get('/all', async (req, res) => {
    try {
        let buildingDistribution = {};
        let roomDistribution = {
            campuses: {},
            laboratory: 0,
            classroom: 0,
            administrative: 0
        };
        let totalAssets = 0;
        let totalBuildings = 0;
        let totalRooms = 0;

        const buildingsResponse = await axios.get('http://localhost:5050/api/dashboard/building-distribution');
        buildingDistribution = buildingsResponse.data;

        const roomsResponse = await axios.get('http://localhost:5050/api/dashboard/room-distribution');
        roomDistribution = roomsResponse.data;

        const assetsResponse = await axios.get('http://localhost:5050/api/dashboard/total-assets');
        totalAssets = assetsResponse.data.totalAssets;

        const buildingsCountResponse = await axios.get('http://localhost:5050/api/dashboard/total-buildings');
        totalBuildings = buildingsCountResponse.data.Buildings;

        const roomsCountResponse = await axios.get('http://localhost:5050/api/dashboard/total-rooms');
        totalRooms = roomsCountResponse.data.Rooms;

        res.json({
            buildingDistribution,
            roomDistribution,
            totalAssets,
            totalBuildings,
            totalRooms
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/building-distribution', async (req, res) => {
    try {
        let query = {};

        if (req.query.campus && req.query.campus !== 'all') {
            query.campus = req.query.campus;
        }

        const buildings = req.query.campus === 'all' ? await Building.find() : await Building.find(query);
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
        let query = {};

        if (req.query.campus && req.query.campus !== 'all') {
            const buildings = await Building.find({ campus: req.query.campus });
            query.buildingId = { $in: buildings.map(building => building._id) };
        }

        const rooms = req.query.campus === 'all' ? await Room.find().populate('buildingId', 'campus') : await Room.find(query).populate('buildingId', 'campus');
        const roomDistribution = {};

        rooms.forEach(room => {
            const campus = room.buildingId.campus;
            if (!roomDistribution[campus]) {
                roomDistribution[campus] = {
                    laboratory: 0,
                    classroom: 0,
                    administrative: 0
                };
            }
            roomDistribution[campus][room.type.toLowerCase()]++;
        });

        res.json(roomDistribution);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/total-assets', async (req, res) => {
    try {
        let query = {};

        if (req.query.campus && req.query.campus !== 'all') {
            const buildings = await Building.find({ campus: req.query.campus });
            const rooms = await Room.find({ buildingId: { $in: buildings.map(building => building._id) } });
            query.roomId = { $in: rooms.map(room => room._id) };
        }

        const totalAssets = req.query.campus === 'all' ? await Asset.countDocuments() : await Asset.countDocuments(query);
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