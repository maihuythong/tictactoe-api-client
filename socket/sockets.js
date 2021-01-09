const {room} = require("./room");
const authentication = require("./authentication");
module.exports = (io, roomMap) => {
  io.on("connection", (socket) => {
    console.log("user connected");
    authentication(io, socket);
    room(io, socket, roomMap);

    socket.on("disconnect", (token) => {
      console.log("disconnect");
    });
  });
};