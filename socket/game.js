const Game = require("../models/game");
const User = require("../models/user");
const { verifyToken } = require("../helpers/tokenUtils");
const user = require("../models/user");

const game = (io, socket) => {
  socket.on("joinRoom", async (data) => {
    socket.join(data.gameId.toString());
    // console.log("User has join room" + data.gameId);
    io.to(data.gameId).emit("gameCreated", {
      message: `Created game ${data.gameId}`,
      gameId: data.gameId,
    });

    const games = await Game.find({ status: "playing" });
    socket.broadcast.emit("newGameCreated", games);
  });

  socket.on("joinGame", async (data) => {
    console.log(`join ${data.gameId}`);
    socket.join(data.gameId);

    // const decodedToken = verifyToken(data.token);
    const game = await Game.findOne({ gameId: data.gameId });
    const guest = await User.findOne({ _id: game.guest });
    const host = await User.findOne({ _id: game.host });

    let guestResponse = null;
    if(guest){
      guestResponse = {
        username: guest.username,
        fullName: guest.fullName,
      };
    }
    const hostResponse = {
      username: host.username,
      fullName: host.fullName,
    };
    io.to(data.gameId).emit("guestJoined", {
      host: hostResponse,
      guest: guestResponse,
    });
  });

  socket.on("joinExistedRoom", async (data) => {
    socket.join(data.gameId.toString());
  });

  socket.on("sendMessage", async (data) => {
    console.log(data.gameId);
    io.to(data.gameId).emit("newMessage", {
      message: data.message,
    });
  })
};

module.exports = game;
