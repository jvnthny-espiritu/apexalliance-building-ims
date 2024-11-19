const Building = require('../models/Building');
const Room = require('../models/Room');
const Asset = require('../models/Asset');

module.exports = {
  getAllBuildings: async (req, res) => {
    try {
      const { facilities, campus } = req.query;
      let query = {};
      if (facilities) {
        query.facilities = { $in: [facilities] };
      }
      if (campus) {
        query.campus = campus;
      }
  
      const buildings = await Building.find(query)
        .select('-createdAt -updatedAt')
        .populate('campus', 'name'); 
  
      res.json(buildings);
    } catch (err) {
      console.error('Error fetching buildings:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  
  
  createBuilding: async (req, res) => {
    const { buildingName, campus, numberOfFloors, yearBuilt, facilities } = req.body;
    try {
      const building = await Building.create({ name: buildingName, campus, numberOfFloors, yearBuilt, facilities });
      res.status(201).json(building);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  
  getBuildingById: async (req, res) => {
    try {
      const building = await Building.findById(req.params.id);
      if (!building) {
        return res.status(404).json({ error: 'Building not found' });
      }
      res.json(building);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  
  updateBuilding: async (req, res) => {
    try {
      const updatedBuilding = await Building.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedBuilding) {
        return res.status(404).json({ error: 'Building not found' });
      }
      res.json(updatedBuilding);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  
  deleteBuilding: async (req, res) => {
    try {
      
        const deletedBuilding = await Building.findByIdAndDelete(req.params.id);
        if (!deletedBuilding) {
            return res.status(404).json({ error: 'Building not found' });
        }

        const rooms = await Room.find({ building: req.params.id });

        let deletedAssetsCount = 0;
        if (rooms.length > 0) {
            const roomIds = rooms.map(room => room._id);

            await Room.deleteMany({ building: req.params.id });

            const deletedAssets = await Asset.deleteMany({ location: { $in: roomIds } });
            deletedAssetsCount = deletedAssets.deletedCount;
        }

        res.status(200).json({
            message: 'Building deleted successfully. Refresh.',
            deletedRoomsCount: rooms.length,
            deletedAssetsCount: deletedAssetsCount,
        });
    } catch (err) {
        console.error('Error deleting building, rooms, or assets:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  },

  getFacilities: async (req, res) => {
    const { campusId } = req.query;
    try {
      if (campusId && campusId !== 'all') {
        const facilities = await Building.distinct('facilities', { campus: campusId });
        return res.json(facilities);
    } else {
        const facilities = await Building.distinct('facilities');
        res.json(facilities);
    }    
    } catch (err) {
      console.error('Error fetching facilities:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getRoomByFloor: async (req, res) => {
    const building = req.params.id;
    try {
      if (!building) {
        return res.status(400).json({ error: 'Building ID is required' });
      }
      const rooms = await Room.find({ building });
      const roomsByFloor = rooms.reduce((acc, room) => {
        const floor = room.floor;
        if (!acc[floor]) {
          acc[floor] = [];
        }
        acc[floor].push(room);
        return acc;
      }, {});
      res.json(roomsByFloor);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).json({ error: 'An error occurred while fetching rooms' });
    }
  }
};
