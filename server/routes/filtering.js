const express = require('express');
const router = express.Router();
const Building = require('../models/building');
const Room = require('../models/room');
const Asset = require('../models/asset');
const User = require('../models/user');

// Buildings API with filtering
router.get('/buildings', async (req, res) => {
    try {
        let query = {};

        if (req.query.campus) {
            query.campus = req.query.campus;
        }
        if (req.query.purpose) {
            query.purpose = req.query.purpose;
        }

        const buildings = await Building.find(query);
        res.json(buildings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rooms API with filtering
router.get('/rooms', async (req, res) => {
    try {
        let query = {};

        if (req.query.buildingId) {
            query.buildingId = req.query.buildingId;
        }
        if (req.query.type) {
            query.type = req.query.type;
        }
        if (req.query.status) {
            query.status = req.query.status;
        }

        const rooms = await Room.find(query);
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Assets API with filtering
router.get('/assets', async (req, res) => {
    try {
        let query = {};

        if (req.query.roomId) {
            query.roomId = req.query.roomId;
        }
        if (req.query.type) {
            query.type = req.query.type;
        }
        if (req.query.condition) {
            query.condition = req.query.condition;
        }
        if (req.query.purchaseDate) {
            query.purchaseDate = req.query.purchaseDate;
        }

        const assets = await Asset.find(query);
        res.json(assets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Users API with filtering
router.get('/users', async (req, res) => {
    try {
        let query = {};

        if (req.query.role) {
            query.role = req.query.role;
        }
        if (req.query.campus) {
            query.campus = req.query.campus;
        }

        const users = await User.find(query);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;