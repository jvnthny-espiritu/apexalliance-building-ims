const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ success: false, message: 'All fields are required' });
            }
            const user = await User.findOne({ username }).populate('campus');
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
            const auth = await bcrypt.compare(password, user.password);
            if (!auth) {
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
            const token = jwt.sign({ user: user._id, firstName: user.fullName.firstName, lastName: user.fullName.lastName, role: user.role, campus: user.campus._id}, 'apexalliance', { expiresIn: '1h' });
            res.cookie("token", token, { httpOnly: true });
            return res.status(200).json({ success: true, message: "User logged in successfully", token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Login failed' });
        }
    }
}