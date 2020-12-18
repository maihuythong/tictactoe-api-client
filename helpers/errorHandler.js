class ErrorHandler extends Error {
  constructor(statusCode, message) {
      super(message);
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.statusCode = statusCode;
  }
}

const handleError = (err, res) => {
  const {statusCode, message} = err;
  return res.status(statusCode).json({
      message: message
  });
}

module.exports = {ErrorHandler, handleError};