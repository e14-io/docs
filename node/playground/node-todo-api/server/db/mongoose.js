const config = require('./../config/config.json');
const mongoose = require('mongoose');

// We indicate to mongoose that we will be using the built-in promise library
mongoose.Promise = global.Promise;

// Creating the connection
mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/TodoApp`);

module.exports = { mongoose };
