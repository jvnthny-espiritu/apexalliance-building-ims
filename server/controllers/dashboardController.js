const Asset = require('../models/Asset');
const Building = require('../models/Building');
const Room = require('../models/Room');
const Campus = require('../models/Campus');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

exports.getAllMetrics = async (req, res) => {
  try {
      const [totalAssets, totalBuildings, totalRooms, totalCampuses, totalUsers] = await Promise.all([
          Asset.countDocuments(),
          Building.countDocuments(),
          Room.countDocuments(),
          Campus.countDocuments(),
          User.countDocuments()
      ]);

      res.json({ totalAssets, totalBuildings, totalRooms, totalCampuses, totalUsers });
  } catch (error) {
      res.status(500).json({ message: `Failed to fetch metrics: ${error.message}` });
  }
};

exports.getBuildingDistribution = async (req, res) => {
  try {
      const buildingDistribution = await Building.aggregate([
        {
          '$unwind': {
            'path': '$facilities'
          }
        }, {
          '$group': {
            '_id': {
              'campus': '$campus', 
              'facility': '$facilities'
            }, 
            'count': {
              '$sum': 1
            }
          }
        }, {
          '$lookup': {
            'from': 'campus', 
            'localField': '_id.campus', 
            'foreignField': '_id', 
            'as': 'campus'
          }
        }, {
          '$unwind': {
            'path': '$campus'
          }
        }, {
          '$group': {
            '_id': '$campus.name', 
            'facilities': {
              '$push': {
                'facility': '$_id.facility', 
                'count': '$count'
              }
            },
            'totalBuildings': { '$sum': 1 }
          }
        }, {
          '$project': {
            'campus': '$_id', 
            'facilities': 1, 
            'totalBuildings': 1,
            '_id': 0
          }
        }
      ]);
      res.json(buildingDistribution);
  } catch (error) {
      res.status(500).json({ message: `Failed to fetch building distribution: ${error.message}` });
  }
};

// room distribution
exports.getRoomDistribution = async (req, res) => {
  try {
    const roomDistribution = await Room.aggregate([
      {
        '$group': {
          '_id': {
            'building': '$building',
            'purpose': '$purpose'
          },
          'count': {
            '$sum': 1
          }
        }
      },
      {
        '$lookup': {
          'from': 'buildings',
          'localField': '_id.building',
          'foreignField': '_id',
          'as': 'building'
        }
      },
      {
        '$unwind': {
          'path': '$building'
        }
      },
      {
        '$lookup': {
          'from': 'campus',
          'localField': 'building.campus',
          'foreignField': '_id',
          'as': 'campus'
        }
      },
      {
        '$unwind': {
          'path': '$campus'
        }
      },
      {
        '$project': {
          '_id': 0,
          'campus': '$campus.name',
          'building': '$building.name',
          'purpose': '$_id.purpose',
          'count': '$count'
        }
      }
    ]);

    res.status(200).json(roomDistribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// asset distribution
exports.getAssetDistribution = async (req, res) => {
    try {
        // aggregate data for categories
        const categoryDistribution = await Asset.aggregate([
          {
            '$lookup': {
              'from': 'rooms', 
              'localField': 'location', 
              'foreignField': '_id', 
              'as': 'room'
            }
          }, {
            '$unwind': '$room'
          }, {
            '$lookup': {
              'from': 'buildings', 
              'localField': 'room.building', 
              'foreignField': '_id', 
              'as': 'building'
            }
          }, {
            '$unwind': '$building'
          }, {
            '$lookup': {
              'from': 'campus', 
              'localField': 'building.campus', 
              'foreignField': '_id', 
              'as': 'campus'
            }
          }, {
            '$unwind': '$campus'
          }, {
            '$group': {
              '_id': {
                'campus': '$campus.name', 
                'category': '$category'
              }, 
              'count': {
                '$sum': 1
              }
            }
          }, {
            '$group': {
              '_id': '$_id.category', 
              'campuses': {
                '$push': {
                  'campus': '$_id.campus', 
                  'count': '$count'
                }
              }, 
              'total': {
                '$sum': '$count'
              }
            }
          }, {
            '$project': {
              '_id': 0, 
              'category': '$_id', 
              'campuses': 1, 
              'total': 1
            }
          }
        ]);

        // aggregate data for conditions
        const conditionDistribution = await Asset.aggregate([
          {
            '$lookup': {
              'from': 'rooms', 
              'localField': 'location', 
              'foreignField': '_id', 
              'as': 'room'
            }
          }, {
            '$unwind': '$room'
          }, {
            '$lookup': {
              'from': 'buildings', 
              'localField': 'room.building', 
              'foreignField': '_id', 
              'as': 'building'
            }
          }, {
            '$unwind': '$building'
          }, {
            '$lookup': {
              'from': 'campus', 
              'localField': 'building.campus', 
              'foreignField': '_id', 
              'as': 'campus'
            }
          }, {
            '$unwind': '$campus'
          }, {
            '$group': {
              '_id': {
                'campus': '$campus.name', 
                'condition': '$condition'
              }, 
              'count': {
                '$sum': 1
              }
            }
          }, {
            '$group': {
              '_id': '$_id.condition', 
              'campuses': {
                '$push': {
                  'campus': '$_id.campus', 
                  'count': '$count'
                }
              }, 
              'total': {
                '$sum': '$count'
              }
            }
          }, {
            '$project': {
              '_id': 0, 
              'condition': '$_id', 
              'campuses': 1, 
              'total': 1
            }
          }
        ]);

        // aggregate data for statuses
        const statusDistribution = await Asset.aggregate([
          {
            '$lookup': {
              'from': 'rooms', 
              'localField': 'location', 
              'foreignField': '_id', 
              'as': 'room'
            }
          }, {
            '$unwind': '$room'
          }, {
            '$lookup': {
              'from': 'buildings', 
              'localField': 'room.building', 
              'foreignField': '_id', 
              'as': 'building'
            }
          }, {
            '$unwind': '$building'
          }, {
            '$lookup': {
              'from': 'campus', 
              'localField': 'building.campus', 
              'foreignField': '_id', 
              'as': 'campus'
            }
          }, {
            '$unwind': '$campus'
          }, {
            '$group': {
              '_id': {
                'campus': '$campus.name', 
                'status': '$status'
              }, 
              'count': {
                '$sum': 1
              }
            }
          }, {
            '$group': {
              '_id': '$_id.status', 
              'campuses': {
                '$push': {
                  'campus': '$_id.campus', 
                  'count': '$count'
                }
              }, 
              'total': {
                '$sum': '$count'
              }
            }
          }, {
            '$project': {
              '_id': 0, 
              'status': '$_id', 
              'campuses': 1, 
              'total': 1
            }
          }
        ]);

        res.status(200).json({ categoryDistribution, conditionDistribution, statusDistribution });
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch asset distribution: ${error.message}` });
    }
};

// user actions log
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch audit logs: ${error.message}` });
  }
};