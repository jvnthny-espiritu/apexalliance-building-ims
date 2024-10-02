const { parse } = require('json2csv');
const Room = require('../models/room');
const Building = require('../models/building');
const Campus = require('../models/campus');
const Asset = require('../models/asset');

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
            let query = {};

            if (campusFilter) {
                const campusId = await getCampusId(campusFilter);
                if (campusId) {
                    query.campus = campusId;
                } else {
                    return res.status(404).json({ message: 'Campus not found' });
                }
            }

            const buildings = await Building.find(query).populate('campus', 'name');
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

            const csv = parse(data, { fields });
            res.header('Content-Type', 'text/csv');
            res.attachment('buildings_report.csv');
            return res.send(csv);
        }

        if (type === 'building_with_rooms') {
            let buildingQuery = {};

            if (campusFilter) {
                const campusId = await getCampusId(campusFilter);
                if (campusId) {
                    buildingQuery.campus = campusId;
                } else {
                    return res.status(404).json({ message: 'Campus not found' });
                }
            }

            if (buildingFilter) {
                buildingQuery.name = buildingFilter;
            }
        
            const buildings = await Building.find(buildingQuery);
            if (!buildings.length) {
                return res.status(404).json({ message: 'No buildings found' });
            }
        
            const fields = ['Building Name', 'Room Name', 'Purpose', 'Room Status'];
            const data = [];
        
            for (const building of buildings) {
                let roomQuery = { building: building._id };
        
                if (roomPurpose) roomQuery.purpose = roomPurpose.trim();
                if (roomStatus) roomQuery.status = roomStatus.trim(); 
        
                const rooms = await Room.find(roomQuery);
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
                console.log("No rooms found for the specified filters");
                return res.status(404).json({ message: 'No rooms found for the specified filters' });
            }
        
            const csv = parse(data, { fields });
            res.header('Content-Type', 'text/csv');
            res.attachment('rooms_report.csv');
            return res.send(csv);
        }                

        if (type === 'room_with_assets') {
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

        
            const building = await Building.findOne(buildingQuery);
            if (!building) {
                return res.status(404).json({ message: 'Building not found' });
            }
        
            let roomQuery = { building: building._id };

            if (req.query.room) {
                roomQuery.name = req.query.room.trim(); 
            }
        
            const rooms = await Room.find(roomQuery);
            if (!rooms.length) {
                console.log("Room not found for query:", roomQuery);
                return res.status(404).json({ message: 'Room not found' });
            }
        
            let data = [];
            for (const room of rooms) {
                let assetQuery = { location: room._id };
        
                if (assetCategory) assetQuery.category = assetCategory.trim();
                if (assetCondition) assetQuery.condition = assetCondition.trim();
                if (assetStatus) assetQuery.status = assetStatus.trim(); 
        
                const assets = await Asset.find(assetQuery);
        
                if (assets.length > 0) {
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
            }
        
            if (data.length === 0) {
                console.log("No assets found for the specified filters");
                return res.status(404).json({ message: 'No assets found for the specified filters' });
            }
        
            const fields = ['Room Name', 'Asset Name', 'Category', 'Condition', 'Status'];
            const csv = parse(data, { fields });
            res.header('Content-Type', 'text/csv');
            res.attachment('assets_report.csv');
            return res.send(csv);
        }                                        

        return res.status(400).json({ message: 'Invalid report type specified.' });

    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: 'Error generating report', error: error.message });
    }
};
