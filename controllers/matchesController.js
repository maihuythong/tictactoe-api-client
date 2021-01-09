const Match = require("../models/match");
const { ErrorHandler } = require("../helpers/errorHandler");
const catchAsync = require("../helpers/catchAsync");
const factoryController = require("./factoryController");

exports.createNewMatch = factoryController.createOne(Match);
exports.deleteMatch = factoryController.deleteOne(Match);
exports.updateMatch = factoryController.updateOne(Match);
exports.getMatches = factoryController.getAll(Match);
exports.getOneMatch = factoryController.getOne(Match);
