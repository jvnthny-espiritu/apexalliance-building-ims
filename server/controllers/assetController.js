const Asset = require('../models/Asset');

module.exports = {
  getAllAssets: async (req, res) => {
    try {
      const { room, category, status, condition } = req.query;
      
      if (!room) {
        return res.status(400).json({ error: 'Room parameter is required' });
      }
      
      const filter = { location: room };
      
      if (category) {
        filter.category = category;
      }
      if (status) {
        filter.status = status;
      }
      if (condition) {
        filter.condition = condition;
      }
      const assets = await Asset.find(filter).populate('location');
      
      res.json(assets);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createAsset: async (req, res) => {
    const { name, category, condition, status, location, purchaseDate, value, numberOfUnits, electricDetails, nonElectricDetails } = req.body;

    try {
      const newAsset = await Asset.create({ name, category, condition, status, location, purchaseDate, value, numberOfUnits, electricDetails, nonElectricDetails });
      res.status(201).json(newAsset);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  getAssetById: async (req, res) => {
    try {
      const asset = await Asset.findById(req.paramsid).populate('location');
      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      res.json(asset);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateAsset: async (req, res) => {
    try {
      const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('location');
      if (!updatedAsset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      res.json(updatedAsset);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  deleteAsset: async (req, res) => {
    try {
      const deletedAsset = await Asset.findByIdAndDelete(req.params.id);
      if (!deletedAsset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      res.json({ message: 'Asset deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
