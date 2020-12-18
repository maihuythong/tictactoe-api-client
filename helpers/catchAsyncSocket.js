const { ErrorHandler } = require("./errorHandler");

module.exports = catchAsync => async (data) => {
    try {
        await catchAsync(data);
    } catch (error) {
        console.log(error);
    }
};
