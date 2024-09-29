const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
}, { timestamps: true });

const Report = mongoose.model('Asset', reportSchema);

module.exports = Report;
