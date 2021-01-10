const Room = require("../models/room");
const { ErrorHandler } = require("../helpers/errorHandler");
const catchAsync = require("../helpers/catchAsync");
const factoryController = require("./factoryController");
const Match = require("../models/match");
const roomMap  = require('../database/roomMap');
exports.createNewRoom = factoryController.createOne(Room);
exports.deleteRoom = factoryController.deleteOne(Room);
exports.updateRoom = factoryController.updateOne(Room);
exports.getRooms = factoryController.getAll(Room);
exports.getOneRoom = factoryController.getOne(Room);

exports.joinRoom = catchAsync(async (req, res, next) => {
  const roomId = req.params.id;
  const room = await Room.findOne({ roomId: roomId });
  if (room) {
    if (room.password) {
      if (!req.body.password)
        return next(new ErrorHandler(400, "Require password!"));
      const checkPassword = await room.validPassword(req.body.password);
      if (!checkPassword)
        return next(new ErrorHandler(400, "Incorrect password!"));
    }
    const updateRoom = await Room.findOneAndUpdate(
      { roomId: roomId },
      { $push: { viewers: req.user } }
    );
    if (updateRoom) {
      res
        .status(200)
        .json({ status: "success", message: "Join room successfully!" });
    } else {
      return next(new ErrorHandler(400, "Can't join room!"));
    }
  } else {
    next(
      new ErrorHandler(400, "Something went wrong! Please try again later!")
    );
  }
});

exports.getRoomInfo = catchAsync(async (req, res, next) => {
  
  const roomId = req.params.id;
  const matches = await Match.find({ roomId: roomId });
  console.log(matches);
  if(roomMap[roomId]!==undefined){
    res
      .status(200)
      .json({ status: "success", body: { roomInfo: roomMap[roomId], matches: matches } });
  }else {
    next(
      new ErrorHandler(400, "Cant find roomId in maps socket!")
    );
  }

});
