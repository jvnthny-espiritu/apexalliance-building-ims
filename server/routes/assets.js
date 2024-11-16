const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const auditLogger = require('../middleware/auditLogger');

// Routes for assets 
router.get('/', assetController.getAllAssets);
router.get('/:id', assetController.getAssetById);
router.post('/', authenticateJWT, authorizeRoles('admin', 'staff'), auditLogger('CREATE'), assetController.createAsset);
router.put('/:id', authenticateJWT, authorizeRoles('admin', 'staff'), auditLogger('UPDATE'), assetController.updateAsset);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), auditLogger('DELETE'), assetController.deleteAsset);

module.exports = router;
