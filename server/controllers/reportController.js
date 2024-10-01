const { parse } = require('json2csv'); 
const Room = require('../models/room'); 
const Building = require('../models/building'); 
const Campus = require('../models/campus'); 
const Asset = require('../models/asset'); 

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

        async function getCampusId(campusName) {
            const campusData = await Campus.findOne({ name: campusName });
            return campusData ? campusData._id : null;
        }

        if (type === 'building') {
            let query = {};
            if (campusFilter) {
                const campusId = await getCampusId(campusFilter);
                if (campusId) {
                    query.campus = campusId; 
                }
            }
            const buildings = await Building.find(query).populate('campus', 'name');
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
                }
            }
            const buildings = await Building.find(buildingQuery);
            const fields = ['Building Name', 'Room Name', 'Purpose', 'Room Status'];
            const data = [];

            for (const building of buildings) {
                const rooms = await Room.find({ building: building._id }); 
                rooms.forEach(room => {
                    data.push({
                        'Building Name': building.name,
                        'Room Name': room.name,
                        'Purpose': room.purpose,
                        'Room Status': room.status,
                    });
                });
            }

            const csv = parse(data, { fields });
            res.header('Content-Type', 'text/csv');
            res.attachment('buildings_with_rooms_report.csv');
            return res.send(csv);
        }

        if (type === 'room') {
            let roomQuery = {};
            if (roomPurpose) roomQuery.purpose = roomPurpose;
            if (roomStatus) roomQuery.status = roomStatus;

            const rooms = await Room.find(roomQuery).populate('building');
            const fields = ['Building Name', 'Room Name', 'Purpose', 'Room Status'];
            const data = rooms.map(room => ({
                'Building Name': room.building ? room.building.name : 'N/A',
                'Room Name': room.name,
                'Purpose': room.purpose,
                'Room Status': room.status,
            }));

            const csv = parse(data, { fields });
            res.header('Content-Type', 'text/csv');
            res.attachment('rooms_report.csv');
            return res.send(csv);
        }

        if (type === 'room_with_assets') {
            let roomQuery = {};
            if (roomPurpose) roomQuery.purpose = roomPurpose;
            if (roomStatus) roomQuery.status = roomStatus;

            const rooms = await Room.find(roomQuery);
            const fields = ['Room Name', 'Asset Name', 'Category', 'Condition', 'Status'];
            const data = [];

            for (const room of rooms) {
                const assets = await Asset.find({ location: room._id }); 
                assets.forEach(asset => {
                    data.push({
                        'Room Name': room.name,
                        'Asset Name': asset.name,
                        'Category': asset.category,
                        'Condition': asset.condition,
                        'Status': asset.status,
                    });
                });
            }

            const csv = parse(data, { fields });
            res.header('Content-Type', 'text/csv');
            res.attachment('rooms_with_assets_report.csv');
            return res.send(csv);
        }

        if (type === 'asset') {
            let assetQuery = {};
            if (assetCategory) assetQuery.category = assetCategory;
            if (assetCondition) assetQuery.condition = assetCondition;
            if (assetStatus) assetQuery.status = assetStatus;

            const assets = await Asset.find(assetQuery).populate('location'); 
            const fields = ['Room Name', 'Asset Name', 'Category', 'Condition', 'Status'];
            const data = assets.map(asset => ({
                'Room Name': asset.location ? asset.location.name : 'N/A',
                'Asset Name': asset.name,
                'Category': asset.category,
                'Condition': asset.condition,
                'Status': asset.status,
            }));

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
