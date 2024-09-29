const Building = require('../models/building');
const Room = require('../models/room');
const Asset = require('../models/asset');
const Activity = require('../models/activity');
const Campus = require('../models/campus');

exports.getBuildingDistribution = async (req, res) => {
    try {
        const buildingDistribution = await Building.aggregate([
            { $group: { _id: "$campus", count: { $sum: 1 } } }
        ]);

        const data = await Promise.all(buildingDistribution.map(async item => {
            const campus = await Campus.findById(item._id);
            return { name: campus.name, value: item.count };
        }));

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRoomDistribution = async (req, res) => {
    try {
        const roomDistribution = await Room.aggregate([
            {
                '$lookup': {
                    'from': 'buildings',
                    'localField': 'building',
                    'foreignField': '_id',
                    'as': 'buildingDetails'
                }
            },
            { '$unwind': { 'path': '$buildingDetails' } },
            {
                '$lookup': {
                    'from': 'campus',
                    'localField': 'buildingDetails.campus',
                    'foreignField': '_id',
                    'as': 'campusDetails'
                }
            },
            { '$unwind': { 'path': '$campusDetails' } },
            {
                '$group': {
                    '_id': {
                        'campusId': '$buildingDetails.campus',
                        'campusName': '$campusDetails.name',
                        'type': '$type'
                    },
                    'count': { '$sum': 1 }
                }
            },
            {
                '$group': {
                    '_id': {
                        'campusId': '$_id.campusId',
                        'campusName': '$_id.campusName'
                    },
                    'types': {
                        '$push': {
                            'type': '$_id.type',
                            'count': '$count'
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
            result[item._id.campusName] = types;
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTotalAssets = async (req, res) => {
    try {
        const totalAssets = await Asset.countDocuments();
        res.json({ totalAssets });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTotalBuildings = async (req, res) => {
    try {
        const totalBuildings = await Building.countDocuments();
        res.json({ Buildings: totalBuildings });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTotalRooms = async (req, res) => {
    try {
        const totalRooms = await Room.countDocuments();
        res.json({ Rooms: totalRooms });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getActivityLog = async (req, res) => {
    try {
        const activities = await Activity.find().populate('user', 'firstName lastName');
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
