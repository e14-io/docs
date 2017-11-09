const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongodb server');
  };
  console.log('Connected to mongodb server');

  // update a document and retrieve it
  db.collection('Todos')
    .findOneAndUpdate({
      _id: new ObjectID('5a0365379aab91636aca3e1f')
    }, {
      // To update a document property
      // we need to use update operators (for example $set)
      $set: {
        completed: true
      }
    }, {
      // returnOriginal is set true by default
      // but we want to get back the document updated
      returnOriginal: false
    })
    .then((result) => {
      console.log(result);
    })

  db.close();
});
