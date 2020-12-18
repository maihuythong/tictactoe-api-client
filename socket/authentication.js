const User = require('../models/user');
const Game = require('../models/game');
const {verifyToken} = require('../helpers/tokenUtils');
const catchAsyncSocket = require('../helpers/catchAsyncSocket');

const authentication = (io, socket) => {
  socket.on("login", catchAsyncSocket( async (data) => {
    const decodedToken = await verifyToken(data.token);
    // handle case facebook, google (not username) ...
    const id = await (await User.findOne({ username: decodedToken.username }))
      ._id;
    if (decodedToken) {
      const doc = await setStatus(id, "online");
      if (doc) {
        const listUsers = await User.find({ status: "online" });
        const listGames = await Game.find({ status: "playing" });
        io.emit("list", {listUsers: listUsers, listGames: listGames});
      }
    }
  }));

  socket.on("logout", catchAsyncSocket( async (data) => {
    const decodedToken = await verifyToken(data.token);
    // handle case facebook, google (not username) ...
    const id = await (await User.findOne({ username: decodedToken.username }))
      ._id;
    if (decodedToken) {
      const doc = await setStatus(id, "offline");
      if (doc) {
        const listUsers = await User.find({ status: "online" });
        io.emit("list", {listUsers});
      }
    }
  }));
};

module.exports = authentication;


const setStatus = async (id, status) => {
  return await User.findOneAndUpdate(
    { _id: id },
    { status: status },
    { new: true, useFindAndModify: false }
  );
};