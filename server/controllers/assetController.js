const Asset = require('../models/Asset');
const Room = require('../models/Room'); 

module.exports = {
  getAllAssets: async (req, res) => {
    try {
      const { room, category, status, report } = req.query;

      if (!room) {
        return res.status(400).json({ error: 'Room parameter is required' });
      }

      const filter = { location: room };
      if (category) filter.category = category;
      if (status) filter.status = status;
      if (report) filter.report = report;

      const assets = await Asset.find(filter).populate('location');
      res.status(200).json(assets);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  },

  createAsset: async (req, res) => {
    const { 
      name, 
      category, 
      report = '', 
      status = 'good condition', 
      location, 
      purchaseDate, 
      value, 
      numberOfUnits = 1, 
      electricDetails, 
      nonElectricDetails 
    } = req.body;

    if (!name || !category || !location) {
      return res.status(400).json({ error: 'Name, category, and location are required' });
    }

    try {
      const room = await Room.findOne({ name: location });
      if (!room) {
        return res.status(404).json({ error: `Room with name "${location}" not found` });
      }

      const newAsset = await Asset.create({ 
        name, 
        category, 
        report, 
        status, 
        location: room._id, 
        purchaseDate, 
        value, 
        numberOfUnits, 
        electricDetails, 
        nonElectricDetails 
      });

      res.status(201).json(newAsset);
    } catch (err) {
      console.error("Error during asset creation:", err.message); // Log the error
      res.status(400).json({ error: 'Failed to create asset', details: err.message });
    }
},


  getAssetById: async (req, res) => {
    try {
      const asset = await Asset.findById(req.params.id).populate('location');
      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      res.status(200).json(asset);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  },

  updateAsset: async (req, res) => {
    try {
      const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('location');
      if (!updatedAsset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      res.status(200).json(updatedAsset);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update asset', details: err.message });
    }
  },

  deleteAsset: async (req, res) => {
    try {
      const deletedAsset = await Asset.findByIdAndDelete(req.params.id);
      if (!deletedAsset) {
        console.log("Asset not found for deletion.");
        return res.status(404).json({ error: 'Asset not found' });
      }
      console.log("Asset deleted successfully:", deletedAsset);
      res.status(200).json({ message: 'Asset deleted successfully' });
    } catch (err) {
      console.error("Error deleting asset:", err.message);
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  }
};
