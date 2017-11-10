// We create a middleware for authentication
// We export it to use it on every request we want to protect.

const { User } = require('./../models/user');

const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    // We use the model method findByToken
    // to get back the user to whom it belongs
    User.findByToken(token)
      .then((user) => {
        if (!user) {
          return Promise.reject();
        };
  
        // We modify the request object to get access to the user and his token
        // from the next middleware on the chain.
        req.user = user;
        req.token = token
        next();
      })
      .catch((e) => {
        // If findByToken returns an error we know token didn't validate
        // in that case we will sent back an 401 error.
        res.status(401).send();
      })
  };

module.exports = { authenticate }