const express = require('express');
const routes = require('./routes');
const dbConnection = require('./config/database');

const app = express();

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
