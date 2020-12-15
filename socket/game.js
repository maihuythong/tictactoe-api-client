const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Game = require("../models/game");

const game = (io, socket) => {

  socket.on("joinRoom", async (data) => {
    // console.log(data.gameId);
    socket.join(data.gameId.toString());
    // console.log("User has join room" + data.gameId);
    io.to(data.gameId).emit("gameCreated", {
      message: `Created game ${data.gameId}`,
      gameId: data.gameId,
    });

    const games = await Game.find({status: 'playing'});
    socket.broadcast.emit("newGameCreated", games);
  });

  socket.on("roomMessage", (data) => {
    console.log(data);
  });
};

module.exports = game;
