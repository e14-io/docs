const { expect } = require('chai');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server/server');
const { Todo }  = require('../server/models/todo');

const todos = [{
   _id: new ObjectID(),
   text: "First todo test"
},{
   _id: new ObjectID(),
   text: "Second todo test",
   completed: true,
   completedAt: 333
}];

describe('POST /todos', () => {

  beforeEach((done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos)
        })
        .then(() => done())
        .catch((err) => {
            done(err);
        })
  });

  it('should create a new todo', (done) => {
    var text = "Test todo text";

    request(app)
      .post('/todos')
      // pass data trought post
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).to.be.equal(text)
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        Todo.find({text})
          .then((todos) => {
            expect(todos.length).to.be.equal(1);
            expect(todos[0].text).to.be.equal(text);
            done();
          })
          .catch(done)
      })
  });

  it('should not create todo with invalid body data', (done) => {
    var text = "Test todo text";

    request(app)
      .post('/todos')
      // pass data trought post
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        Todo.find()
          .then((todos) => {
            expect(todos.length).to.be.equal(2);
            done();
          })
          .catch(done)
      })
  });

})


describe('GET /todos', () => {

  it('should get all todos', (done) => {
    var text = "Test todo text";

    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).to.be.equal(2)
      })
      .end(done)
  });

  it('should return todo doc', (done) => {
    var text = "Test todo text";

    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).to.be.equal(todos[0].text)
      })
      .end(done)
  });

  it('should return a 404 if todo not found', (done) => {
    var text = "Test todo text";

    request(app)
      .get(`/todos/${new ObjectID( )}`)
      .expect(404)
      .end(done)
  });

  it('should return a 400 for non-object-id', (done) => {
    var text = "Test todo text";

    request(app)
      .get(`/todos/123`)
      .expect(400)
      .end(done)
  });

  describe('PATCH /todos:id', () => {

    it('should update a todo', (done) => {
      const _id = todos[0]._id.toHexString();
      const text = "Todo updated"

      request(app)
        .patch(`/todos/${_id}`)
        .send({text: text, completed: true})
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).to.be.equal(text);
          expect(res.body.todo.completed).to.be.equal(true);
          expect(res.body.todo.completedAt).to.be.an('number');
        })
        .end(done);
    });

    it('sould clear completed at when todo is not completed', (done) => {

      const _id = todos[1]._id.toHexString();
      const text = "Second todo updated"

      request(app)
        .patch(`/todos/${_id}`)
        .send({text: text, completed: false})
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).to.be.equal(text);
          expect(res.body.todo.completed).to.be.equal(false);
          expect(res.body.todo.completedAt).to.be.equal(null);
        })
        .end(done);

    })

  });

  describe('DELETE /todos:id', () => {

    it('should remove a todo', (done) => {
      const _id = todos[0]._id.toHexString();

      request(app)
        .delete(`/todos/${_id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).to.be.equal(_id);
        })
        .end((err, res) => {
          if (err) {
            done(err);

          }

          Todo.findById(_id)
          .then((todo) => {
            expect(todo).to.be.equal(null);
            done();
          })
          .catch(done)

        });
    });

    it('should return 404 if todo not found', (done) => {
      const _id = new ObjectID().toHexString();

      request(app)
        .delete(`/todos/${_id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if Object id is invalid', (done) => {

      request(app)
        .delete(`/todos/123`)
        .expect(400)
        .end(done);
    })
  })

});
