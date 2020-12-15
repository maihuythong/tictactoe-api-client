const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      return decodedToken;
  } catch (e){
      return false;
  }
}

module.exports = {verifyToken: verifyToken};