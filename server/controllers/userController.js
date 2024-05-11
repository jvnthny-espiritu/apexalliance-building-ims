const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().populate('campus', 'name');
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  createUser: async (req, res) => {
    const { fullName, username, email, role, campus, password } = req.body;
    console.log("Received request body:", req.body);
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const newUser = await User.create({ fullName, username, email, role, campus, password });
      res.status(201).json(newUser);
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ message: "Failed to create user", error: err.message });
    }
  },
  
  
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate('campus');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password, email, campus, fullName, role } = req.body; 
    
      console.log('Received request to update user with ID:', id);
  
      const user = await User.findById(id);
      if (!user) {
        console.error('User not found for ID:', id);
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      if (username) {
        console.log('Checking if username is available:', username);
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== id) {
          console.error('Username already exists:', username);
          return res.status(400).json({ success: false, message: 'Username already exists' });
        }
        user.username = username;
      }
  
      if (password) {
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
  
      if (email) {
        console.log('Updating email...');
        user.email = email;
      }
  
      if (campus) {
        console.log('Updating campus...');
        user.campus = campus;
      }
  
      if (fullName) {
        console.log('Updating full name...');
        if (fullName.firstName) {
          user.fullName.firstName = fullName.firstName;
        }
        if (fullName.lastName) {
          user.fullName.lastName = fullName.lastName;
        }
      }
      
      if (role) {
        console.log('Updating role...');
        user.role = role;
      }
  
      console.log('Saving updated user to the database...');
      const updatedUser = await user.save();
  
      console.log('User updated successfully:', updatedUser);
      return res.status(200).json({ success: true, message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
    }
  },
  
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
