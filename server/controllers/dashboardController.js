const Asset = require('../models/asset');
const Building = require('../models/building');
const Room = require('../models/room');
const Activity = require('../models/activity');
const Campus = require('../models/campus');

// asset metrics
exports.getAssetMetrics = async (req, res) => {
    try {
        const totalAssets = await Asset.countDocuments();
        
        const assetCategoriesDistribution = await Asset.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        const assetConditionDistribution = await Asset.aggregate([
            { $group: { _id: '$condition', count: { $sum: 1 } } }
        ]);

        const assetStatusDistribution = await Asset.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            totalAssets,
            assetCategoriesDistribution: assetCategoriesDistribution.map(item => ({
                category: item._id,
                count: item.count
            })),
            assetConditionDistribution: assetConditionDistribution.map(item => ({
                condition: item._id,
                count: item.count
            })),
            assetStatusDistribution: assetStatusDistribution.map(item => ({
                status: item._id,
                count: item.count
            })),
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch asset metrics: ' + error.message });
    }
};

// building metrics
exports.getBuildingMetrics = async (req, res) => {
    try {
        const totalBuildings = await Building.countDocuments();

        const buildingDistribution = await Building.aggregate([
            { $group: { _id: '$campus', count: { $sum: 1 } } }
        ]);

        const facilitiesDistribution = await Building.aggregate([
            { $group: { _id: '$purpose', count: { $sum: 1 } } }
        ]);

        res.json({
            totalBuildings,
            buildingDistribution: buildingDistribution.map(item => ({
                campus: item._id,
                count: item.count
            })),
            facilitiesDistribution: facilitiesDistribution.map(item => ({
                facility: item._id,
                count: item.count
            })),
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch building metrics: ' + error.message });
    }
};

// room metrics
exports.getRoomMetrics = async (req, res) => {
    try {
        const totalRooms = await Room.countDocuments();

        const roomPurposeDistribution = await Room.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        res.json({
            totalRooms,
            roomPurposeDistribution: roomPurposeDistribution.map(item => ({
                purpose: item._id,
                count: item.count
            })),
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch room metrics: ' + error.message });
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