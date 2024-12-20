const express = require('express');
const router = express.Router();
const campusController = require('../controllers/campusController');

router.get('/', campusController.getAllCampuses);
router.post('/', campusController.addCampus);
router.get('/:id', campusController.getCampusById);


module.exports = router;