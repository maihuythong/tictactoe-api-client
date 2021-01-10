const {room} = require("./room");
const authentication = require("./authentication");
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected");
    authentication(io, socket);
    room(io, socket);

    socket.on("disconnect", (token) => {
      console.log("disconnect");
    });
  });
};