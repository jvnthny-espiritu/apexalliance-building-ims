const Asset = require('../models/Asset');
const Building = require('../models/Building');
const Room = require('../models/Room');
const Campus = require('../models/Campus');

// asset metrics
exports.getAssetMetrics = async (req, res) => {
    try {
        const totalAssets = await Asset.countDocuments();
        res.json({ totalAssets });
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch asset metrics: ${error.message}` });
    }
};

// building metrics
exports.getBuildingMetrics = async (req, res) => {
    try {
        const totalBuildings = await Building.countDocuments();
        res.json({ totalBuildings });
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch building metrics: ${error.message}` });
    }
};

// room metrics
exports.getRoomMetrics = async (req, res) => {
    try {
        const totalRooms = await Room.countDocuments();
        res.json({ totalRooms });
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch room metrics: ${error.message}` });
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
            }
          }
        }, {
          '$project': {
            'campus': '$_id', 
            'facilities': 1, 
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


// helper ni porman sa baba
const aggregateData = (data, key) => {
    return data.reduce((acc, item) => {
        const id = item[key];
        const campus = item.campus;
        const existing = acc.find(i => i.id === id && i.campus === campus);
        if (existing) {
            existing.value += item.count;
        } else {
            acc.push({
                id,
                label: id,
                value: item.count,
                campus
            });
        }
        return acc;
    }, []);
};
// asset distribution
exports.getAssetDistribution = async (req, res) => {
    try {
        // aggregate data for categories
        const categoryDistribution = await Asset.aggregate([
            {
                '$group': {
                    '_id': {
                        'category': '$category',
                        'campus': '$location'
                    },
                    'count': {
                        '$sum': 1
                    }
                }
            },
            {
                '$lookup': {
                    'from': 'rooms',
                    'localField': '_id.campus',
                    'foreignField': '_id',
                    'as': 'room'
                }
            },
            {
                '$unwind': {
                    'path': '$room'
                }
            },
            {
                '$lookup': {
                    'from': 'buildings',
                    'localField': 'room.building',
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
                    'category': '$_id.category',
                    'campus': '$campus.name',
                    'count': '$count'
                }
            }
        ]);

        // aggregate data for conditions
        const conditionDistribution = await Asset.aggregate([
            {
                '$group': {
                    '_id': {
                        'condition': '$condition',
                        'campus': '$location'
                    },
                    'count': {
                        '$sum': 1
                    }
                }
            },
            {
                '$lookup': {
                    'from': 'rooms',
                    'localField': '_id.campus',
                    'foreignField': '_id',
                    'as': 'room'
                }
            },
            {
                '$unwind': {
                    'path': '$room'
                }
            },
            {
                '$lookup': {
                    'from': 'buildings',
                    'localField': 'room.building',
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
                    'condition': '$_id.condition',
                    'campus': '$campus.name',
                    'count': '$count'
                }
            }
        ]);

        // aggregate data for statuses
        const statusDistribution = await Asset.aggregate([
            {
                '$group': {
                    '_id': {
                        'status': '$status',
                        'campus': '$location'
                    },
                    'count': {
                        '$sum': 1
                    }
                }
            },
            {
                '$lookup': {
                    'from': 'rooms',
                    'localField': '_id.campus',
                    'foreignField': '_id',
                    'as': 'room'
                }
            },
            {
                '$unwind': {
                    'path': '$room'
                }
            },
            {
                '$lookup': {
                    'from': 'buildings',
                    'localField': 'room.building',
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
                    'status': '$_id.status',
                    'campus': '$campus.name',
                    'count': '$count'
                }
            }
        ]);

        const categoryData = aggregateData(categoryDistribution, 'category');
        const conditionData = aggregateData(conditionDistribution, 'condition');
        const statusData = aggregateData(statusDistribution, 'status');

        const response = { categoryData, conditionData, statusData };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch asset distribution: ${error.message}` });
    }
};