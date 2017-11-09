const { mongoose } = require('../db/mongoose');

 // We define a new model
const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

// const user = new User({
//   email: "schubert@bros.me"
// });
//
// user.save()
//   .then((doc) => {
//     console.log('Saved todo', doc)
//   }, (e) => {
//     console.log('Unable to save todo', e)
//   })


module.exports = { User };
