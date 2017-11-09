const { mongoose } = require('../db/mongoose');

// We define a model
const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// const newTodo = new Todo({
//   text: "Feed the cat",
//   completed: true,
//   completedAt: 123
// });
//
// newTodo.save()
//   .then((doc) => {
//     console.log('Saved todo', doc)
//   }, (e) => {
//     console.log('Unable to save todo', e)
//   })

module.exports = { Todo };
