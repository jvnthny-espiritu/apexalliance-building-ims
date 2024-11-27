const { parse } = require('json2csv');
const Room = require('../models/Room');
const Building = require('../models/Building');
const Campus = require('../models/Campus');
const Asset = require('../models/Asset');

async function getCampusId(campusName) {
    const campusData = await Campus.findOne({
        name: new RegExp('^' + campusName.trim() + '$', 'i')
    });
    
    if (campusData) {
        return campusData._id;
    } else {
        return null;
    }
}

exports.getUniqueBuildingNames = async (req, res) => {
    try {
        const { campus } = req.query;

        let query = {};

        if (campus) {
            const campusId = await getCampusId(campus);
            if (campusId) {
                query.campus = campusId;
            } else {
                return res.status(404).json({ message: 'Campus not found' });
            }
        }
        
        const buildings = await Building.distinct('name', query);

        if (!buildings.length) {
            return res.status(404).json({ message: 'No buildings found for the specified campus' });
        }

        return res.status(200).json(buildings);
    } catch (error) {
        console.error("Error fetching unique building names:", error);
        res.status(500).json({ message: 'Error fetching building names', error: error.message });
    }
};


exports.exportReport = async (req, res) => {
    try {
        const { type, campus: campusFilter, building: buildingFilter, assetStatus } = req.query;

        if (type === 'building_room_assets') {
            let buildingQuery = {};

            if (campusFilter) {
                const campusId = await getCampusId(campusFilter);
                if (campusId) {
                    buildingQuery.campus = campusId;
                } else {
                    console.log(`Campus "${campusFilter}" not found`);
                    return res.status(404).json({ message: 'Campus not found' });
                }
            }

            if (buildingFilter) {
                buildingQuery.name = buildingFilter;
            }

            // Fetch buildings based on the filter
            const buildings = await Building.find(buildingQuery);

            if (!buildings.length) {
                return res.status(404).json({ message: 'No buildings found for the specified filters' });
            }

            const fields = ['Building', 'Room', 'Asset', 'Units', 'Condition', 'Status'];
            const data = [];

            for (const building of buildings) {
                const rooms = await Room.find({ building: building._id });

                for (const room of rooms) {
                    const assetsQuery = { location: room._id };

                    if (assetStatus) {
                        assetsQuery.status = assetStatus;
                    }

                    const assets = await Asset.find(assetsQuery);

                    const groupedAssets = assets.reduce((acc, asset) => {
                        const key = `${asset.name}-${asset.status}`;
                        if (!acc[key]) {
                            acc[key] = {
                                name: asset.name,
                                condition: asset.report || 'N/A',
                                status: asset.status,
                                count: 0,
                            };
                        }
                        acc[key].count += asset.numberOfUnits || 1;
                        return acc;
                    }, {});

                    for (const [key, group] of Object.entries(groupedAssets)) {
                        data.push({
                            'Building': building.name,
                            'Room': room.name,
                            'Asset': group.name,
                            'Units': group.count,
                            'Condition': group.condition,
                            'Status': group.status,
                        });
                    }
                }
            }

            if (data.length === 0) {
                console.log('No assets found for the specified filters');
                return res.status(404).json({ message: 'No assets found for the specified filters' });
            }

            const csv = parse(data, { fields });
            res.header('Content-Type', 'text/csv');
            res.attachment('building_room_assets_report.csv');
            return res.send(csv);
        }

        return res.status(400).json({ message: 'Invalid report type specified.' });

    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: 'Error generating report', error: error.message });
    }
};