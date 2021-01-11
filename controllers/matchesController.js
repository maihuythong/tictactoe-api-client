const Match = require("../models/match");
const { ErrorHandler } = require("../helpers/errorHandler");
const catchAsync = require("../helpers/catchAsync");
const factoryController = require("./factoryController");

exports.createNewMatch = factoryController.createOne(Match);
exports.deleteMatch = factoryController.deleteOne(Match);
exports.updateMatch = factoryController.updateOne(Match);
exports.getMatches = factoryController.getAll(Match);
exports.getOneMatch = factoryController.getOne(Match);

exports.getAllMatchOfUser = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    const doc = await Match.find({ winner: userId }, { loser: userId });
    if (doc) {
        res.status(200).json({
            status: "success",
            body: doc,
        });
    }
    else {
        next(new ErrorHandler(400, 'cant get matches of this userId'));
    }
});
