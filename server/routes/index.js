const express = require('express');
const router = express.Router();
const Building = require('../models/building');
const Room = require('../models/room');
const Asset = require('../models/asset');
const User = require('../models/user');


// Define routes for buildings
router.get('/buildings', async (req, res) => {
    try {
        const buildings = await Building.find();
        res.json(buildings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/buildings', async (req, res) => {
    const building = new Building({
        name: req.body.name,
        purpose: req.body.purpose,
        campus: req.body.campus,
        numOfStory: req.body.numOfStory
    });

    try {
        const newBuilding = await building.save();
        res.status(201).json(newBuilding);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Define routes for rooms
router.get('/rooms', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/rooms', async (req, res) => {
    const room = new Room({
        buildingId: req.body.buildingId,
        name: req.body.name,
        floor: req.body.floor,
        type: req.body.type,
        capacity: req.body.capacity,
        status: req.body.status
    });

    try {
        const newRoom = await room.save();
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Define routes for asset
router.get('/asset', async (req, res) => {
    try {
        const asset = await Asset.find();
        res.json(asset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/asset', async (req, res) => {
    const asset = new Asset({
        roomId: req.body.roomId,
        name: req.body.name,
        type: req.body.type,
        quantity: req.body.quantity,
        serialNumber: req.body.serialNumber,
        purchaseDate: req.body.purchaseDate,
        condition: req.body.condition,
        electricConsumption: req.body.electricConsumption
    });

    try {
        const newAsset = await asset.save();
        res.status(201).json(newAsset);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/users', async (req, res) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role,
        campus: req.body.campus,
        hashedPassword: req.body.hashedPassword
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
