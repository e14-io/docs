const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb')

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middlewares/authenticate');

const app = new express();
const port = process.env.port || 3000;

app.use(bodyParser.json());

// GET /welcome

app.get('/', (req, res) => {
  res.status(200).send("Welcome to node-todo-api")
});

// POST /todos

app.post('/todos', (req, res) => {

  const todo = new Todo({
    text: req.body.text
  })

  todo.save()
    .then((doc) => {
      res.send(doc)
    }, (e) => {
      res.status(400).send(e)
    })

})

// GET /todos

app.get('/todos', (req, res) => {

  Todo.find()
    .then((todos) => {
      res.send({todos})
    }, (e) => {
      res.status(400).send(e)
  })

})

app.get('/todos/:id', (req, res) => {

  const { id } = req.params;

  // Using mongoose we don't need to create an ObjectId to pass to find.
  // We can simply pass the string id.
  // Although we need to create it to take advantage of the methods that allow us to validate the id.

  if (!ObjectID.isValid(id)) {
    res.status(400).send()
  }

  Todo.findById(req.params.id)
    .then((todo) => {
      if (!todo) {
        res.send(404).send('Todo not found')
      }
      res.send({todo})
    }, (e) => {
      res.status(400).send(e)
  })

})

// PATCH /todos

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ["text", "completed"])

  if (!ObjectID.isValid(id)) {
    res.status(400).send()
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then((todo) => {
      if (!todo) {
        res.send(404).send('Todo not found')
      }
      res.send({todo})
    }, (e) => {
      res.status(400).send(e)
  })

});

// DELETE /todos/:id

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(400).send()
  }

  Todo.findByIdAndRemove(id)
    .then((todo) => {
      if (!todo) {
        res.send(404).send('Todo not found')
      }
      res.send({todo})
    })
    .catch((e) => {
      res.status(400).send(e)      
    })

});

// POST /users

app.post('/users', (req, res) => {

  // We use lodash pick to retrieve only a few properties of the request object.
  const body = _.pick(req.body, ["email", "password"]);
  const user = new User(body);

  user.save()
    .then(() => {
      // We use the class method we create to generate the access token.
      return user.generateAuthToken();
    })
    .then((token) => {
      // We save the token on the custom header x-auth
      res.header('x-auth', token).send(user);
    })
    .catch((e) => {
      res.status(400).send(e)
    })

});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
})

app.listen(port, () => {
  console.log(`Started on port: ${port}`)
});

module.exports = { app }
