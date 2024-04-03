const mongoose = require('mongoose');
const dbURI = 'mongodb+srv://admin:admin@facility-assets.cd8kndv.mongodb.net/?retryWrites=true&w=majority&appName=facility-assets';

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

module.exports = mongoose.connection;