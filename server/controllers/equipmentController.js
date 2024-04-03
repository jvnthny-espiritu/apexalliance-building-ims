const Asset = require('../models/assetModel');

module.exports = {
  getAllEquipment: async (req, res) => {
    try {
      const asset = await Asset.find();
      res.json(asset);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  createEquipment: async (req, res) => {
    const asset = new Asset({
      roomId: req.body.roomId,
      name: req.body.name,
      type: req.body.type,
      quantity: req.body.quantity,
      serialNumber: req.body.serialNumber,
      purchaseDate: req.body.purchaseDate,
      condition: req.body.condition,
      electricConsumption: req.body.electricConsumption
    });

    try {
      const newEquipment = await asset.save();
      res.status(201).json(newEquipment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getEquipmentById: async (req, res) => {
    try {
      const asset = await Asset.findById(req.params.id);
      if (!asset) {
        return res.status(404).json({ message: 'Asset not found' });
      }
      res.json(asset);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateEquipment: async (req, res) => {
    try {
      const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!asset) {
        return res.status(404).json({ message: 'Asset not found' });
      }
      res.json(asset);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  deleteEquipment: async (req, res) => {
    try {
      const asset = await Asset.findByIdAndDelete(req.params.id);
      if (!asset) {
        return res.status(404).json({ message: 'Asset not found' });
      }
      res.json({ message: 'Asset deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
