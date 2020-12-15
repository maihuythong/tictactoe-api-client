// import User from '../models/user';
const game = require("./game");
const authentication = require("./authentication");

// const socket = (io) => {
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected");
    authentication(io, socket);
    game(io, socket);

    socket.on("disconnect", (token) => {
      console.log("disconnect");
    });
  });
};