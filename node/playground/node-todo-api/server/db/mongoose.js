const mongoose = require('mongoose');

// We indicate to mongoose that we will be using the built-in promise library
mongoose.Promise = global.Promise;

// Creating the connection
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };
