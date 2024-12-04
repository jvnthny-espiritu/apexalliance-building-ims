require('dotenv').config();
require('./config/db-connection');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('./config/passport-config');
const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// CORS configuration
const allowedOrigins = ['http://localhost:3000', 'https://batstate-u-bims-b87db44e916e.herokuapp.com'];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

// Routes
const userRoutes = require('./routes/users');
const campusRoutes = require('./routes/campus');
const buildingRoutes = require('./routes/buildings');
const roomRoutes = require('./routes/rooms');
const assetRoutes = require('./routes/assets');
const dashboardRoutes = require('./routes/dashboard');
const reportRoutes = require('./routes/reports');

app.use('/api/users', userRoutes);
app.use('/api/campuses', campusRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;       // Export for testing