const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('./logger');
const routes = require('./routes');
const Marker = require('./models/markerModel');
require('dotenv').config();

mongoose.connect(process.env.MONGO_CONNECTION_STRING,
  { useMongoClient:true,
    promiseLibrary: global.Promise }
);

const app = express();

app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/' + 'index.html');
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App is running on port ${port}`);
});
