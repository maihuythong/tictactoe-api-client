const Room = require("../models/room");
const User = require("../models/user");
const catchAsyncSocket = require("../helpers/catchAsyncSocket");
const { verifyToken } = require("../helpers/tokenUtils");
const roomMap = require('../database/roomMap');
const room = (io, socket) => {
  socket.on(
    "createNewRoom",
    catchAsyncSocket(async (data) => {
      const rooms = await Room.find({ status: ["waiting player", "playing"] });
      const roomId = data.roomId.toString();
      const newRoom = {
        viewers: [],
        player1Status: false,
        player2Status: false,
        player1: null,
        player2: null,
        currentBoard: [],
        currentMatch: data.matchId,
      }
      roomMap[roomId] = newRoom;
      io.emit("newRoomCreated", rooms);
    })
  );

  // roomId, token, matchId
  socket.on(
    "joinRoom",
    catchAsyncSocket(async (data) => {
      const roomId = data?.roomId.toString();
      const decodedToken = await verifyToken(data.token);
      if (decodedToken) {
        const user = await User.findOne({ username: decodedToken.username });
        socket.join(roomId);
        roomMap[roomId].viewers.push(user);
        io.in(roomId).emit("viewerTrigger", roomMap[roomId].viewers);
      }
    })
  );

  // token, room id
  socket.on(
    "leaveRoom",
    catchAsyncSocket(async (data) => {
      const roomId = data.roomId;
      const decodedToken = await verifyToken(data.token);
      if (decodedToken) {
        roomMap[roomId].viewers = roomMap[roomId].viewers.filter(
          (viewer) => viewer.username !== decodedToken.username
        );
        io.in(roomId).emit("viewerTrigger", roomMap[roomId].viewers);
        socket.leave(roomId);
      }
    })
  );

  // token, roomId, chair = true = 1, false = 2
  socket.on(
    "pickPlayer",
    catchAsyncSocket(async (data) => {
      const roomId = data.roomId;
      const decodedToken = await verifyToken(data.token);
      const user = await User.findOne({ username: decodedToken.username });
      if (decodedToken) {
        if (data.chair) {
          if (!roomMap[roomId]?.player1) {
            roomMap[roomId].player1 = user;
          }
        } else {
          if (!roomMap[roomId]?.player2) {
            roomMap[roomId].player2 = user;
          }
        }
        io.in(roomId).emit("playerPickChair", {
          player1: roomMap[roomId].player1,
          player2: roomMap[roomId].player2,
        });
      }
    })
  );

  // token, roomId,
  socket.on(
    "leaveChair",
    catchAsyncSocket(async (data) => {
      const roomId = data.roomId;
      const decodedToken = await verifyToken(data.token);
      if (decodedToken) {
        if (roomMap[roomId]?.player1?.username === decodedToken.username) {
          roomMap[roomId].player1 = null;
        }
        if (roomMap[roomId]?.player2?.username === decodedToken.username) {
          roomMap[roomId].player2 = null;
        }
        io.in(roomId).emit("playerPickChair", {
          player1: roomMap[roomId].player1,
          player2: roomMap[roomId].player2,
        });
      }
    })
  );

  // token, roomId, status,
  socket.on(
    "readyTrigger",
    catchAsyncSocket(async (data) => {
      const roomId = data.roomId;
      const decodedToken = await verifyToken(data.token);
      if (decodedToken) {
        if (roomMap[roomId].player1?.username === decodedToken.username) {
          roomMap[roomId].player1Status = data.status;
          console.log(roomMap[roomId].player1Status)
        }
        if (roomMap[roomId]?.player2?.username === decodedToken.username) {
          roomMap[roomId].player2Status = data.status;
        }

        io.in(roomId).emit("playerStatusChange", {
          player1Status: roomMap[roomId].player1Status,
          player2Status: roomMap[roomId].player2Status,
        });
      }
    })
  );

  // roomId, position
  socket.on(
    "play",
    catchAsyncSocket(async (data) => {
      const roomId = data.roomId;
      roomMap[roomId]?.currentBoard.push(data.position);
      io.to(data.roomId).emit("newPlay", { position: data.position });
    })
  );

  socket.on(
    "sendMessage",
    catchAsyncSocket(async (data) => {
      io.to(data.roomId).emit("newMessage", {
        message: data.newMessage,
      });
    })
  );

  socket.on(
    "finishGame",
    catchAsyncSocket(async (data) => {
      const roomId = data.roomId;

      const doc = Match.findOneAndUpdate(
        { _id: roomMap[roomId].currentMatch },
        {
          roomId: data.roomId,
          winner: data.winner,
          loser: data.loser,
          history: roomMap.currentBoard,
          messages: data.messages,
          isDraw: data.isDraw,
        },
        { new: true }
      );

      if (doc) {
        socket.to(roomId).emit("gameFinished", {
          isDraw: data.isDraw,
          winner: data?.winner ?? null,
          loser: data?.loser ?? null,
          winnerLine: data?.winnerLine ?? null,
        });

        if (data.isDraw) {
          try {
            const win = await User.findOneAndUpdate(
              { _id: data.winner },
              { $inc: { draw: 1 } },
              { new: true }
            );

            const lose = await User.findOneAndUpdate(
              { _id: data.loser },
              { $inc: { draw: 1 } },
              { new: true }
            );
          } catch (err) {
            console.log(err);
          }
        } else {
          try {
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
          } catch (err) {
            console.log(err);
          }
        }
      }

      const match = new Match();
      match.save().then((err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        roomMap[roomId].player1Status = false;
        roomMap[roomId].player2Status = false;
        roomMap[roomId].currentBoard = [];
        roomMap[roomId].currentMatch = res._id;
      });
    })
  );
};

module.exports = { room };
