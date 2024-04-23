const express = require('express');
const routes = require('./routes');
const dbConnection = require('./config/database');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
