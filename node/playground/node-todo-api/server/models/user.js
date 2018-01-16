const _ = require('lodash');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const { mongoose } = require('../db/mongoose');

// We define a new schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    // We also can create our own validators function
    // and assign them to the attributes we want to custom validate.
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // We can use an special property called tokens to store all our access tokens
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
}, { bufferCommands: false });

// We can write our own instance methods
UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({
    access,
    token
  });

  return user.save()
    .then(() => {
      return token;
    })

}

// Also we can override an existing one.
UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
}

// We define a model method calling statics
// Here we want to recover a user using his access token
UserSchema.statics.findByToken = function(token) {
  // Model methods get called with the model as the 'this' binding
  const User = this;
  let decoded; 

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch(e) {
    return Promise.reject();
  }

  // To query nested properties we wrap the code with ''
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });

}

// We define a new model
const User = mongoose.model('User', UserSchema);

module.exports = { User };
