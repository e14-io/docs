const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongodb server');
  };
  console.log('Connected to mongodb server');

  db.collection('Todos')
    // All we need to pass is the object we want to delete
    .deleteMany({title: "Eat lunch"})
    .then((result) => {
      console.log(result);
    })

  // delete one is equal to deleteMany with the only difference that instead of delete all the documents,
  // it will delete the first one that matches the criteria
  db.collection('Todos')
    .deleteOne({title: "Eat lunch"})
    .then((result) => {
      console.log(result);
    })

  // delete a document and retrieve it (recommended approach)
  db.collection('Todos')
    .findOneAndDelete({completed: false})
    .then((result) => {
      console.log(result);
    })

  db.close();
});
