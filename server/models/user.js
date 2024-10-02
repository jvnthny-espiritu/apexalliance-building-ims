const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
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
    fullName: {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Administrator', 'Staff'],
        default: 'Staff'
    },
    campus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campus',
        required: true
    }
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare password
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;