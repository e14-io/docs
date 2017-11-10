const MongoClient = require('mongodb').MongoClient;

// Here we create the connection to our local mongodb server
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongodb server');
  };
  console.log('Connected to mongodb server');

  db.collection('Todos').insertOne({
    title: "Something to do",
    completed: false
  }, (err, result) => {
    if (err) {
      console.log('Unable to insert todo', err);
    }

    console.log(JSON.stringify(result.ops, undefined, 2))
  })

  db.collection('Users').insertOne({
    name: "Schubert",
    age: 24,
    location: 'Montevideo'
  }, (err, result) => {
    if (err) {
      console.log('Unable to insert user', err);
    }

    console.log(JSON.stringify(result.ops, undefined, 2))
  })

  db.close();
});
