const express = require('express');
const router = express.Router();
const Building = require('../models/building');
const Room = require('../models/room');
const Asset = require('../models/asset');
const Activity = require('../models/activity');

router.get('/building-distribution', async (req, res) => {
    try {
        const buildingDistribution = await Building.aggregate([
            { $group: { _id: "$campus", count: { $sum: 1 } } }
        ]);
        const data = buildingDistribution.map(item => ({ name: item._id, value: item.count }));
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/room-distribution', async (req, res) => {
    try {
        const roomDistribution = await Room.aggregate([
            {
                $lookup: {
                    from: "buildings",
                    localField: "buildingId",
                    foreignField: "_id",
                    as: "buildingDetails"
                }
            },
            {
                $unwind: "$buildingDetails"
            },
            {
                $group: {
                    _id: {
                        campus: "$buildingDetails.campus",
                        type: "$type"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.campus",
                    types: {
                        $push: {
                            type: "$_id.type",
                            count: "$count"
                        }
                    }
                }
            }
        ]);

        const result = {};
        roomDistribution.forEach(item => {
            const types = {};
            item.types.forEach(type => {
                types[type.type.toLowerCase()] = type.count;
            });
            result[item._id] = types;
        });

        res.json(result);
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

router.get('/activity-log', async (req, res) => {
    try {
      const activities = await Activity.find().populate('user', 'firstName lastName'); // Populate user details if needed
      res.json(activities);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


module.exports = router;
