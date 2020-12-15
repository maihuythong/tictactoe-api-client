const Game = require("../models/game");
const { ErrorHandler } = require("../helpers/errorHandler");

// module.exports.getAllBoard = (req, res, next) => {
//   Board.find({ owner: req.userData.id, isDeleted: false })
//     .then((docs) => {
//       res.status(200).json(docs);
//     })
//     .catch((err) => next(new ErrorHandler(err.status, err.message)));
// };

module.exports.createNewGame = async (req, res, next) => {
  let newGame = new Game({
    host: req.userData.id,
  });
  const doc = await newGame.save();
  if (doc) {
    res.status(200).json({ status: "200 OK", body: doc });
  } else {
    next(new ErrorHandler(400, "Can't create new game! Please try again"));
  }
};

module.exports.joinGame = async (req, res, next) => {
  // console.log(req.userData.id);
  const userId = req.userData.id;
  const { gameId } = req.body;
  const game = await Game.findOne({ gameId: gameId, status: "playing" });

  if (game) {
    if (!game.guest) {
      const doc = await Game.findOneAndUpdate(
        { gameId: gameId },
        { guest: userId },
        { new: true }
      );
      if (doc) {
        res.status(200).json({ status: "200 OK" });
      }
    } else {
      // viewer
      next(new ErrorHandler(400, "Can't join this game!"));
    }
  }else {
    next(new ErrorHandler(400, "Can't join this game!"));
  }
};
