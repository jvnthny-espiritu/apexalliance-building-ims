`const { parse } = require('json2csv');
const Room = require('../models/Room');
const Building = require('../models/Building');
const Campus = require('../models/Campus');
const Asset = require('../models/Asset');

async function getCampusId(campusName) {
    const campusData = await Campus.findOne({
        name: new RegExp('^' + campusName.trim() + '$', 'i')
    });
    return campusData ? campusData._id : null;
}

async function fetchBuildings(campusFilter, buildingFilter) {
    let query = {};
    if (campusFilter) {
        const campusId = await getCampusId(campusFilter);
        if (campusId) {
            query.campus = campusId;
        } else {
            throw new Error('Campus not found');
        }
    }
    if (buildingFilter) {
        query.name = buildingFilter;
    }
    return Building.find(query).populate('campus', 'name');
}

async function fetchRooms(buildingId, roomPurpose, roomStatus) {
    let query = { building: buildingId };
    if (roomPurpose) query.purpose = roomPurpose.trim();
    if (roomStatus) query.status = roomStatus.trim();
    return Room.find(query);
}

async function fetchAssets(roomId, assetCategory, assetCondition, assetStatus) {
    let query = { location: roomId };
    if (assetCategory) query.category = assetCategory.trim();
    if (assetCondition) query.condition = assetCondition.trim();
    if (assetStatus) query.status = assetStatus.trim();
    return Asset.find(query);
}

function generateCSV(data, fields, filename, res) {
    const csv = parse(data, { fields });
    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    res.send(csv);
}

exports.exportReport = async (req, res) => {
    try {
        const {
            type,
            campus: campusFilter,
            building: buildingFilter,
            roomPurpose,
            roomStatus,
            assetCategory,
            assetCondition,
            assetStatus
        } = req.query;

        if (type === 'building') {
            const buildings = await fetchBuildings(campusFilter, buildingFilter);
            if (!buildings.length) {
                return res.status(404).json({ message: 'No buildings found for the specified campus' });
            }

            const fields = ['Building Name', 'Number of Floors', 'Year Built', 'Campus'];
            const data = buildings.map(building => ({
                'Building Name': building.name,
                'Number of Floors': building.numberOfFloors,
                'Year Built': building.yearBuilt,
                'Campus': building.campus ? building.campus.name : 'N/A'
            }));

            return generateCSV(data, fields, 'buildings_report.csv', res);
        }

        if (type === 'building_room_assets') {
            const buildings = await fetchBuildings(campusFilter, buildingFilter);
            if (!buildings.length) {
                return res.status(404).json({ message: 'No buildings found for the specified filters' });
            }


            const fields = ['Building', 'Room', 'Asset', 'Units', 'Condition', 'Status'];
            const data = [];


            for (const building of buildings) {
                const rooms = await fetchRooms(building._id);
                for (const room of rooms) {
                    const assets = await fetchAssets(room._id);
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
                        acc[key].count += asset.numberOfUnits || 1;
                        return acc;
                    }, {});

                    for (const group of Object.values(groupedAssets)) {
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
                return res.status(404).json({ message: 'No assets found for the specified filters' });
            }

            return generateCSV(data, fields, 'building_room_assets_report.csv', res);
        }

        if (type === 'building_with_rooms') {
            const buildings = await fetchBuildings(campusFilter, buildingFilter);
            if (!buildings.length) {
                return res.status(404).json({ message: 'No buildings found' });
            }

            const fields = ['Building Name', 'Room Name', 'Purpose', 'Room Status'];
            const data = [];

            for (const building of buildings) {
                const rooms = await fetchRooms(building._id, roomPurpose, roomStatus);
                rooms.forEach(room => {
                    data.push({
                        'Building Name': building.name,
                        'Room Name': room.name,
                        'Purpose': room.purpose,
                        'Room Status': room.status
                    });
                });
            }

            if (data.length === 0) {
                return res.status(404).json({ message: 'No rooms found for the specified filters' });
            }

            return generateCSV(data, fields, 'rooms_report.csv', res);
        }

        if (type === 'room_with_assets') {
            const buildings = await fetchBuildings(campusFilter, buildingFilter);
            if (!buildings.length) {
                return res.status(404).json({ message: 'Building not found' });
            }

            const building = buildings[0];
            const rooms = await fetchRooms(building._id, req.query.room);
            if (!rooms.length) {
                return res.status(404).json({ message: 'Room not found' });
            }

            const fields = ['Room Name', 'Asset Name', 'Category', 'Condition', 'Status'];
            const data = [];

            for (const room of rooms) {
                const assets = await fetchAssets(room._id, assetCategory, assetCondition, assetStatus);
                assets.forEach(asset => {
                    data.push({
                        'Room Name': room.name,
                        'Asset Name': asset.name,
                        'Category': asset.category,
                        'Condition': asset.condition,
                        'Status': asset.status
                    });
                });
            }

            if (data.length === 0) {
                return res.status(404).json({ message: 'No assets found for the specified filters' });
            }

            return generateCSV(data, fields, 'assets_report.csv', res);
        }

        return res.status(400).json({ message: 'Invalid report type specified.' });

    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: 'Error generating report', error: error.message });
    }
};