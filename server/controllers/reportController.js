const { parse } = require("json2csv");

const Building = require("../models/Building");
const Room = require("../models/Room");
const Asset = require("../models/Asset");
const Campus = require("../models/Campus");

async function getCampusId(campusName) {
    const campusData = await Campus.findOne({
        name: new RegExp("^" + campusName.trim() + "$", "i"),
    });
    return campusData ? campusData._id : null;
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
            assetStatus,
        } = req.query;

        const ensureValue = (value) => (value != null && value !== "" ? value : "N/A");

        if (type === "building") {
            const query = {};

            if (campusFilter) {
                const campusId = await getCampusId(campusFilter);
                if (!campusId) {
                    return res.status(404).json({ message: "Campus not found" });
                }
                query.campus = campusId;
            }

            const buildings = await Building.find(query).populate("campus", "name");
            if (!buildings.length) {
                return res.status(404).json({ message: "No buildings found for the specified campus" });
            }

            const fields = ["Building Name", "Number of Floors", "Year Built", "Campus"];
            const data = buildings.map((building) => ({
                "Building Name": ensureValue(building.name),
                "Number of Floors": ensureValue(building.numberOfFloors),
                "Year Built": ensureValue(building.yearBuilt),
                "Campus": ensureValue(building.campus?.name),
            }));

            const csv = parse(data, { fields });
            res.header("Content-Type", "text/csv");
            res.attachment("buildings_report.csv");
            return res.send(csv);
        }

        if (type === "building_room_assets") {
            const matchConditions = {};

            if (campusFilter) {
                const campusId = await getCampusId(campusFilter);
                if (!campusId) {
                    return res.status(404).json({ message: "Campus not found" });
                }
                matchConditions["campus"] = campusId;
            }

            if (buildingFilter) {
                matchConditions["name"] = buildingFilter;
            }

            const buildings = await Building.aggregate([
                { $match: matchConditions },
                {
                    $lookup: {
                        from: "rooms",
                        localField: "_id",
                        foreignField: "building",
                        as: "rooms",
                    },
                },
                { $unwind: { path: "$rooms", preserveNullAndEmptyArrays: false } },
                {
                    $lookup: {
                        from: "assets",
                        localField: "rooms._id",
                        foreignField: "location",
                        as: "assets",
                    },
                },
                { $unwind: { path: "$assets", preserveNullAndEmptyArrays: true } },
                {
                    $match: {
                        ...(assetCondition ? { "assets.condition": assetCondition.trim() } : {}),
                        ...(assetStatus ? { "assets.status": assetStatus.trim() } : {}),
                    },
                },
                {
                    $project: {
                        Building: "$name",
                        Room: "$rooms.name",
                        Asset: "$assets.name",
                        Units: "$assets.numberOfUnits",
                        Condition: "$assets.condition",
                        Status: "$assets.status",
                    },
                },
            ]);

            if (!buildings.length) {
                return res.status(404).json({ message: "No data available for the specified filters" });
            }

            const fields = ["Building", "Room", "Asset", "Units", "Condition", "Status"];
            const data = buildings.map((building) => ({
                Building: ensureValue(building.Building),
                Room: ensureValue(building.Room),
                Asset: ensureValue(building.Asset),
                Units: ensureValue(building.Units),
                Condition: ensureValue(building.Condition),
                Status: ensureValue(building.Status),
            }));

            const csv = parse(data, { fields });
            res.header("Content-Type", "text/csv");
            res.attachment("building_room_assets_report.csv");
            return res.send(csv);
        }

        if (type === "building_with_rooms") {
            const buildingQuery = {};

            if (campusFilter) {
                const campusId = await getCampusId(campusFilter);
                if (!campusId) {
                    return res.status(404).json({ message: "Campus not found" });
                }
                buildingQuery.campus = campusId;
            }

            if (buildingFilter) {
                buildingQuery.name = buildingFilter;
            }

            const buildings = await Building.find(buildingQuery).populate("rooms");
            if (!buildings.length) {
                return res.status(404).json({ message: "No buildings found" });
            }

            const fields = ["Building Name", "Room Name", "Purpose", "Room Status"];
            const data = [];

            for (const building of buildings) {
                const rooms = await Room.find({ building: building._id });
                rooms.forEach((room) => {
                    data.push({
                        "Building Name": ensureValue(building.name),
                        "Room Name": ensureValue(room.name),
                        "Purpose": ensureValue(room.purpose),
                        "Room Status": ensureValue(room.status),
                    });
                });
            }

            if (data.length === 0) {
                return res.status(404).json({ message: "No rooms found for the specified filters" });
            }

            const csv = parse(data, { fields });
            res.header("Content-Type", "text/csv");
            res.attachment("rooms_report.csv");
            return res.send(csv);
        }

        if (type === "room_with_assets") {
            const buildingQuery = {};

            if (campusFilter) {
                const campusId = await getCampusId(campusFilter);
                if (!campusId) {
                    return res.status(404).json({ message: "Campus not found" });
                }
                buildingQuery.campus = campusId;
            }

            if (buildingFilter) {
                buildingQuery.name = buildingFilter;
            }

            const building = await Building.findOne(buildingQuery);
            if (!building) {
                return res.status(404).json({ message: "Building not found" });
            }

            const roomQuery = { building: building._id };

            if (req.query.room) {
                roomQuery.name = req.query.room.trim();
            }

            const rooms = await Room.find(roomQuery);
            if (!rooms.length) {
                return res.status(404).json({ message: "No rooms found" });
            }

            const fields = ["Room Name", "Asset Name", "Category", "Condition", "Status"];
            const data = [];

            for (const room of rooms) {
                const assets = await Asset.find({
                    location: room._id,
                    ...(assetCategory ? { category: assetCategory.trim() } : {}),
                    ...(assetCondition ? { condition: assetCondition.trim() } : {}),
                    ...(assetStatus ? { status: assetStatus.trim() } : {}),
                });

                if (assets.length > 0) {
                    assets.forEach((asset) => {
                        data.push({
                            "Room Name": ensureValue(room.name),
                            "Asset Name": ensureValue(asset.name),
                            "Category": ensureValue(asset.category),
                            "Condition": ensureValue(asset.condition),
                            "Status": ensureValue(asset.status),
                        });
                    });
                }
            }

            if (data.length === 0) {
                return res.status(404).json({ message: "No assets found for the specified filters" });
            }

            const csv = parse(data, { fields });
            res.header("Content-Type", "text/csv");
            res.attachment("assets_report.csv");
            return res.send(csv);
        }

        return res.status(400).json({ message: "Invalid report type specified." });
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: "Error generating report", error: error.message });
    }
};