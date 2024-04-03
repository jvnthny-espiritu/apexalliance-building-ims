const express = require('express');
const router = express.Router();
const Building = require('../models/buildingModel');
const Room = require('../models/roomModel');
const Asset = require('../models/assetModel');
const User = require('../models/userModel');


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

// Define routes for equipment
router.get('/equipment', async (req, res) => {
    try {
        const equipment = await Equipment.find();
        res.json(equipment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/equipment', async (req, res) => {
    const equipment = new Equipment({
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
        const newEquipment = await equipment.save();
        res.status(201).json(newEquipment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
