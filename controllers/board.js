const Board = require('../models/board');
const { ErrorHandler } = require('../helpers/errorHandler');

module.exports.getAllBoard = (req, res, next) => {
  Board.find({ owner: req.userData.id, isDeleted: false })
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => next(new ErrorHandler(err.status, err.message)));
};
