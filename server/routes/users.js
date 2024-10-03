const express = require('express');
const router = require('express').Router();
const userController = require('../controllers/userController');

// Routes for users
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
