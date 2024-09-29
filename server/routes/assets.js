const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');


router.get('/', authenticateJWT, authorizeRoles(['admin', 'staff', 'guest']), assetController.getAllAssets);
router.post('/', authenticateJWT, authorizeRoles(['admin', 'staff']), assetController.createAsset);
router.get('/:id', authenticateJWT, authorizeRoles(['admin', 'staff', 'guest']), assetController.getAssetById);
router.put('/:id', authenticateJWT, authorizeRoles(['admin', 'staff']), assetController.updateAsset);
router.delete('/:id', authenticateJWT, authorizeRoles(['admin']), assetController.deleteAsset);

module.exports = router;
