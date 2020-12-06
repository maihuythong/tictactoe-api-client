const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { ErrorHandler } = require('../helpers/errorHandler');

const ignoreAuth = [
  '/api/v1/users/sign-in',
  '/api/v1/users/sign-up',
  '/api/v1/users/auth/google',
  '/api/v1/users/auth/facebook',
];

module.exports = async (req, res, next) => {
  const path = req.originalUrl;

  if (ignoreAuth.includes(path) || path.indexOf('callback') >= 0) {
    next();
  } else {
    try {
      const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
      if (!token) {
        throw new Error('Authentication failed!');
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.userData = { username: decodedToken.username };
      const doc = await User.findOne({ username: req.userData.username });
      if (doc) {
        const id = doc._id;
        req.userData = { ...req.userData, id };
      } else {
        next(new ErrorHandler(400, 'Authentication failed!'));
      }

      next();
    } catch (err) {
      const error = new ErrorHandler(401, 'Authentication failed!');
      return next(error);
    }
  }
};
