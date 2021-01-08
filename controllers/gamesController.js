const Game = require("../models/game");
const { ErrorHandler } = require("../helpers/errorHandler");
const catchAsync = require("../helpers/catchAsync");
const factoryController = require('./factoryController');


exports.createNewGame = factoryController.createOne(Game);
exports.deleteGame = factoryController.deleteOne(Game);
exports.updateGame = factoryController.updateOne(Game);
exports.getGames = factoryController.getAll(Game);
exports.getOneGame = factoryController.getOne(Game);

exports.joinGame = catchAsync (async (req, res, next) => {
  const userId = req.user._id;
  const gameId  = req.params.id;
  const game = await Game.findOne({ gameId: gameId, status: "waiting player" });
  if (game) {
    if(game.password){
      if (!req.body.password) return next(new ErrorHandler(400, "Require password!"));
      const checkPassword = await game.validPassword(req.body.password);
      if(!checkPassword)
        return next(new ErrorHandler(400, "Incorrect password!"));
    }
    if (!game.guest) {
      const doc = await Game.findOneAndUpdate(
        { gameId: gameId },
        { guest: userId , status: "playing"},
        { new: true }
      );
      if (doc) {
        res.status(200).json({ status: "success" });
      }
    } else {
      // viewer
      next(new ErrorHandler(400, "Can't join this game!"));
    }
  }else {
    next(new ErrorHandler(400, "Can't join this game!"));
  }
});
