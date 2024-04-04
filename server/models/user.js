const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  role: String,
  campus: String,
  hashedPassword: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
