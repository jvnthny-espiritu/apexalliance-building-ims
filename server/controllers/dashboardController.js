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
        const building_data = await Promise.all(buildingDistribution.map(async item => {
            const campus = await Campus.findById(item._id);
            return {
                name: campus ? campus.name : 'Unknown Campus',
                value: item.count
            };
        }));

        const facilitiesDistribution = await Building.aggregate([
            { $group: { _id: '$facilities', count: { $sum: 1 } } }
        ]);
        const facilities_data = await Promise.all(facilitiesDistribution.map(async item => {
          const facilities = await Campus.findById(item._id);
          return {
              name: facilities ? facilities.name : 'Unknown Facility',
              value: item.count
          };
        }));

        res.json({
            totalBuildings,
            buildingDistribution: building_data,
            facilitiesDistribution: facilities_data,
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
          {
            '$lookup': {
              'from': 'buildings', 
              'localField': 'building', 
              'foreignField': '_id', 
              'as': 'buildingDetails'
            }
          }, {
            '$unwind': {
              'path': '$buildingDetails'
            }
          }, {
            '$lookup': {
              'from': 'campus', 
              'localField': 'buildingDetails.campus', 
              'foreignField': '_id', 
              'as': 'campusDetails'
            }
          }, {
            '$unwind': {
              'path': '$campusDetails'
            }
          }, /*{
            '$match': {
              'type': { '$ne': null }  // Filter out records where purpose is null or undefined
            }
          },*/ {
            '$group': {
              '_id': {
                'campusId': '$buildingDetails.campus', 
                'campusName': '$campusDetails.name', 
                'type': '$purpose'
              }, 
              'count': {'$sum': 1}
            }
          }, {
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

        const roomPurpose_data = roomPurposeDistribution.map(campus => {
          return{
            campusId: campus._id.campusId,
            campusName: campus._id.campusName,
            roomTypes: campus.types.map(type => ({
              purpose: type.type,
              count: type.count
            }))
          };
        }); 

        res.json({
            totalRooms,
            roomPurposeDistribution: roomPurpose_data,
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