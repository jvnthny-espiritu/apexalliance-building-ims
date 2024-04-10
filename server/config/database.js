let mongoose = require('mongoose');
const dbURI = 'mongodb+srv://admin:admin@facility-assets.cd8kndv.mongodb.net/?retryWrites=true&w=majority&appName=facility-assets';

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(dbURI)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection error');
      });
  }
}

module.exports = new Database();
