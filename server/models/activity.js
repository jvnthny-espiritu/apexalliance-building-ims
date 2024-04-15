const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    object: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModel' },
    onModel: String
},  {timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;