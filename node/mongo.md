### MongoDB

Para comenzar a utilizar mongo, descargamos el paquete desde:

https://www.mongodb.com/download-center?jmp=nav#community

Descomprimimos en descargas y luego copiamos la carpeta al directorio de usuario. Luego creamos un nuevo directorio "mongo-data" donde los datos serán guardados físicamente.

Par iniciar el servidor de base de datos, posicionados en el directorio de usuario ejecutamos:

```sh
  cd mongo/bin
  ./mongod --dbpath ~/mongo-data
```

En otra pestaña ejecutamos mongo y con el servidor corriendo, podemos comenzar a ejecutar consultas sobre nuestra bd.

```sh
  ./mongo
  db.Todos.insert({title: "View new node course"})
  db.Todos.find()
```

También podemos conectarnos utilizando la GUI Robomongo, que podemos descargar desde:

https://robomongo.org/download

### Vocabulario NoSQL

Mapeo de términos que utilizamos para referirnos a una bd relacional y su cotraparte en bases de datos no relacionales.

Una tabla de una bd relacional es representada en una no relacional con el término de colección. Una fila dentro de una tabla es representada como un documento de una colección. A diferencia de SQL en una base de datos noSQL las columnas que componen dicha tabla se nombran como campos los cuales pueden ser diferentes en cada documento.

### Mongo & Node

Para conectarnos con un servidor de base de datos mongo desde una aplicación de node, instalamos:

```sh
  npm i mongodb@2.2.5 --save
```
Luego creamos un archivo playground.js donde escribiremos la conexión e insertaremos nuevas colecciones a nuestra base de datos.

```js

  //require the module
  const MongoClient = require('mongodb').MongoClient;

  // connect to our local mongo db server
  // when we are using mongo we don't need to create a database before we connect to it
  // we can just create it and insert a new row, next we will see the new database created


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


    // We close the connection with our mongo db server
    db.close();
  });

```

### ObjectID

Al insertar nuevos documentos en nuestras colecciones, podemos ver que mongo les asigna una propiedad id. Mongo fue creado para escalar de forma rápida y sencilla, esto implica estar en constante comunicación con distintos servidores de bases de datos para manejar extra carga. Por esta razón preguntar por el id más grande autoincrementado (SQL) no es necesario, ya que los ids son objetos generados de forma aleatoria.

Cada id en mongo es un arreglo de 12 bits. Los primeros cuatro refieren al timestamp de creación de dicho id. Los siguientes tres corresponden a un identificador de la máquina que lo creó. Los siguientes dos corresponden al id de proceso que generó el identificador en cuestión y los últimos tres representan simplemente un valor aleatorio.

### Búsqueda

```js
  // To find a document by id, first we need to create an ObjectId
  // passing as argument the id we want to search for.
  db.collection('Todos')
    .find({_id: new ObjectID('5a034bbcaf5fe818e4468293')})
    // find don't return any data but a pointer to the data
    // to access the real data, we use functions like toArray
    .toArray()
    .then((docs) => {
      console.log('Todos');
      console.log(JSON.stringify(docs, undefined, 2))
    }, (err) => {
      console.log('Unable to fetch todos', err )
    })

  // Find without arguments will retrive all the todos list.
  db.collection('Todos')
    .find()
    // Count allow us to retrieve the number of documents
    // that we have on Todos collection
    .count()
    // Count returns a promise
    .then((count) => {
      console.log(`Todos count: ${count}`);
    }, (err) => {
      console.log('Unable to fetch todos', err )
    })

```

### Eliminación

```js

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

```
### Actualización

```js

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
      // returnOriginal is set to true by default
      // but we want to get back the document updated
      returnOriginal: false
    })
    .then((result) => {
      console.log(result);
    })

```
