const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName:  {
    firstName: {
      type: String,
      required: [true, "Your first name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Your last name is required"],
    }
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  email: {
    type: String,
    required: [true, "Your email is required."],
    unique: true,
    lowercase: true,
    validate: (value) => {
      return validator.isEmail(value);
    }
  },
  campus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campus"
  },
  role: {
    type: String,
    enum: ['Administrator', 'Staff'],
    default: 'Staff'
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
