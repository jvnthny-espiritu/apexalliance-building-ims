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
      const [existingEmail, existingUser] = await Promise.all([
        User.findOne({ email }),
        User.findOne({ username })
      ]);

      const errors = {};

      if (existingEmail) {
        errors.email = "Email already in use";
      }

      if (existingUser) {
          errors.username = "Username already in use";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const newUser = await User.create({
        fullName,
        username,
        email,
        role,
        campus,
        password
      });

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
  
      const errors = {};
  
      if (username && username !== user.username) {
        console.log('Checking if username is available:', username);
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== id) {
          console.error('Username already exists:', username);
          errors.username = 'Username already exists';
        }
      }
  
      if (email && email !== user.email) {
        console.log('Checking if email is available:', email);
        const existingEmail = await User.findOne({ email });
        if (existingEmail && existingEmail._id.toString() !== id) {
          console.error('Email already exists:', email);
          errors.email = 'Email already exists';
        }
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
      }
  
      if (username) user.username = username;
      if (password) user.password = password; 
      if (email) user.email = email;
      if (campus) user.campus = campus;
      
      if (fullName) {
        if (fullName.firstName) user.fullName.firstName = fullName.firstName;
        if (fullName.lastName) user.fullName.lastName = fullName.lastName;
      }
  
      if (role) user.role = role;
  
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
