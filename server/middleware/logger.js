const Activity = require('../models/activity');

const logActivity = (user, action, object, onModel) => {
  const activity = new Activity({
    user,
    action,
    object,
    onModel
  });
  activity.save();
};

module.exports = logActivity;