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
    let guest;
    if(game.guest){
      guest = await User.findOne({ _id: game.guest });
    }
    const host = await User.findOne({ _id: game.host });

    let guestResponse = null;
    if (guest) {
      guestResponse = {
        _id: guest._id,
        username: guest.username,
        fullName: guest.fullName,
      };
    }
    const hostResponse = {
      _id: host._id,
      username: host.username,
      fullName: host.fullName,
    };
    io.to(data.gameId).emit("guestJoined", {
      host: hostResponse,
      guest: guestResponse,
    });
  });

  socket.on("sendMessage", async (data) => {
    io.to(data.gameId).emit("newMessage", {
      message: data.newMessage,
    });
  });

  socket.on("play", async (data) => {
    console.log(data);
    io.to(data.gameId).emit("newPlay", { position: data.position });
  });

  socket.on("finishGame", async (data) => {
    const doc = await Game.findOneAndUpdate(
      { gameId: data.gameId },
      {
        winner: data.winner,
        loser: data.loser,
        history: data.history,
        winnerLine: data.winnerLine,
      },
      { new: true }
    );

    if (doc) {
      const win = await User.findOneAndUpdate(
        { _id: data.winner },
        { $inc: { win: 1 } },
        { new: true }
      );
      
      const lose = await User.findOneAndUpdate(
        { _id: data.loser },
        { $inc: { lose: 1 } },
        { new: true }
      );
    }
  });
};

module.exports = game;
