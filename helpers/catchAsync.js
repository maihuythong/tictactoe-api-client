const { ErrorHandler } = require("./errorHandler");

module.exports = (catchAsync) => async (request, response, next) => {
  try {
    await catchAsync(request, response, next);
  } catch (error) {
    // if (error.name === 'MongoError' && error.code === 11000) {
    //   if (error.keyValue.email != null)
    //     return next(new ErrorHandler(400,'email already exists'));
    //   else if (error.keyValue.username != null)
    //     return next(new ErrorHandler(400,'username already exist'));
    //   return next(new ErrorHandler(400,error));
    // } else {
    //   return next(new ErrorHandler(400,error.message));
    // }
    return next(new ErrorHandler(error, 400));
  }
};
