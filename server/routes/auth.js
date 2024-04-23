const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, campus, role } = req.body;
    const user = new User({ firstName, lastName, email, password, campus, role });
    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating user');
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send('Invalid email or password');
    }
    if (user.role !== 'admin') {
        return res.status(403).send('Access denied. Only admins can log in.');
      }
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    res.send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Login failed');
  }
});

module.exports = router;