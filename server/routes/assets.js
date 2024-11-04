const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const auditLogger = require('../middleware/auditLogger');

// Routes for assets 
router.get('/', assetController.getAllAssets);
router.get('/:id', assetController.getAssetById);
router.post('/', auditLogger('CREATE'), assetController.createAsset);
router.put('/:id', auditLogger('UPDATE'), assetController.updateAsset);
router.delete('/:id', auditLogger('DELETE'), assetController.deleteAsset);

module.exports = router;
