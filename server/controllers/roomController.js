const mongoose = require('mongoose');
const Room = require('../models/Room');
const Asset = require('../models/Asset');
const updateBuildingFacilities = require('../utils/updateBuildingFacilities');

module.exports = {
	getAllRooms: async (req, res) => {
		try {
			const { building, purpose, status } = req.query;
			if (!building) {
				return res.status(400).json({ error: 'Building parameter is required' });
			}
			const filter = { building: new mongoose.Types.ObjectId(building) };
			if (purpose) filter.purpose = purpose;
			if (status) filter.status = status;
			const rooms = await Room.aggregate([
				{ $match: filter },
				{
					$group: {
						_id: '$floor',
						rooms: {
							$push: {
								id: '$_id',
								name: '$name',
								purpose: '$purpose',
								status: '$status',
								floor: '$floor',
								building: '$building'
						}
						}
					}
				},
				{ $sort: { _id: 1 } }
			]);
			res.status(200).json(rooms);
	} catch (error) {
			res.status(500).json({ error: error.message });
	}
	},

	createRoom: async (req, res) => {
		const { building, RoomName, floor, purpose, status } = req.body;

		try {
			const newRoom = await Room.create({ building, name: RoomName, floor, purpose, status });
			await updateBuildingFacilities(newRoom.building);
			res.status(201).json(newRoom);
		} catch (err) {
			res.status(400).json({ error: err.message });
		}
	},

	getFilterOptions: async (req, res) => {
        try {
            const purpose = await Room.distinct("purpose");
            const status = await Room.distinct("status");

            res.status(200).json({ purpose, status });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

	getRoomById: async (req, res) => {
		try {
			const room = await Room.findById(req.params.id);
			if (!room) {
				return res.status(404).json({ error: 'Room not found' });
			}
			res.json(room);
		} catch (err) {
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},

	updateRoom: async (req, res) => {
		try {
			const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
			if (!updatedRoom) {
				return res.status(404).json({ error: 'Room not found' });
			}
			await updateBuildingFacilities(updatedRoom.building);
			res.json(updatedRoom);
		} catch (err) {
			res.status(400).json({ error: err.message });
		}
	},

	deleteRoom: async (req, res) => {
		try {
			const roomId = req.params.id;
			console.log("Deleting Room ID:", roomId);
	
			const deletedRoom = await Room.findByIdAndDelete(roomId);
			if (!deletedRoom) {
				console.error(`Room with ID ${roomId} not found.`);
				return res.status(404).json({ error: "Room not found" });
			}
	
			const deleteAssetsResult = await Asset.deleteMany({ location: roomId });
			res.status(200).json({
				message: "Room successfully deleted.",
				deletedRoom,
				deletedAssetsCount: deleteAssetsResult.deletedCount,
			});
		} catch (err) {
			console.error("Error deleting room:", err);
			res.status(500).json({ error: "Internal Server Error", details: err.message });
		}
	},	
	  
	getAssetByRoom: async (req, res) => {
		try {
			const roomId = req.params.id;
			const { type, condition, date } = req.query;
			const query = { room: roomId };
			if (type) {
				query.type = type;
			}
			if (condition) {
				query.condition = condition;
			}
			if (date) {
				const dateObject = new Date(date);
				const nextDay = new Date(dateObject);
				nextDay.setDate(dateObject.getDate() + 1);
				query.createdAt = {
					$gte: dateObject,
					$lt: nextDay
				};
			}
			const assets = await Asset.find(query);
			res.json(assets);
		} catch (error) {
			console.error('Error fetching assets:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}
};
