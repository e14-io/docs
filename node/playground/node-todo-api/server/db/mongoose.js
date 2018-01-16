const config = require('./../config/config.json');
const mongoose = require('mongoose');

// We indicate to mongoose that we will be using the built-in promise library
mongoose.Promise = global.Promise;

// Build the connection string 
var dbURI = `mongodb://${config.db.host}:${config.db.port}/TodoApp`;

// Create the database connection
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  });
});

module.exports = { mongoose };
