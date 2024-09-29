const express = require('express');
const router = require('express').Router();
const userController = require('../controllers/userController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

router.use(authenticateJWT, authorizeRoles(['admin']));

// Routes for users
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.post('/check-username', userController.checkUsername);
router.post('/check-email', userController.checkEmail);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
