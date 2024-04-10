const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      return validator.isEmail(value);
    }
  },
  role: String,
  campus: String,
  hashedPassword: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
