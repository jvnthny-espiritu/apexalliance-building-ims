const Asset = require('../models/asset');
const logActivity = require('../middleware/logger');

module.exports = {
  getAllAssets: async (req, res) => {
    try {
      const assets = await Asset.find().populate('location');
      res.json(assets);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createAsset: async (req, res) => {
    const { name, category, condition, status, location, purchaseDate, value, numberOfUnits, electricDetails, nonElectricDetails } = req.body;

    try {
      const newAsset = await Asset.create({ name, category, condition, status, location, purchaseDate, value, numberOfUnits, electricDetails, nonElectricDetails });
      logActivity(req.user.id, 'added a new asset', newAsset._id, 'Asset');
      res.status(201).json(newAsset);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  getAssetById: async (req, res) => {
    const { id } = req.params;

    try {
      const asset = await Asset.findById(id).populate('location');
      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      res.json(asset);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateAsset: async (req, res) => {
    const { id } = req.params;

    try {
      const updatedAsset = await Asset.findByIdAndUpdate(id, req.body, { new: true }).populate('location');
      if (!updatedAsset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      logActivity(req.user.id, 'updated an asset', updatedAsset._id, 'Asset');
      res.json(updatedAsset);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  deleteAsset: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedAsset = await Asset.findByIdAndDelete(id);
      if (!deletedAsset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      logActivity(req.user.id, 'deleted an asset', deletedAsset._id, 'Asset');
      res.json({ message: 'Asset deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
