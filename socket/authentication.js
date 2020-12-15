const User = require('../models/user');
const {verifyToken} = require('../helpers/tokenUtils');

const authentication = (io, socket) => {
  socket.on("login", async (token) => {
    const decodedToken = await verifyToken(token.token);
    // handle case facebook, google (not username) ...
    const id = await (await User.findOne({ username: decodedToken.username }))
      ._id;
    if (decodedToken) {
      const doc = await setStatus(id, "online");
      if (doc) {
        const listOnline = await User.find({ status: "online" });
        io.emit("list", listOnline);
      }
    }
  });

  socket.on("logout", async (token) => {
    const decodedToken = await verifyToken(token.token);
    // handle case facebook, google (not username) ...
    const id = await (await User.findOne({ username: decodedToken.username }))
      ._id;
    if (decodedToken) {
      const doc = await setStatus(id, "offline");
      if (doc) {
        const listOnline = await User.find({ status: "online" });
        io.emit("list", listOnline);
      }
    }
  });
};

module.exports = authentication;


const setStatus = async (id, status) => {
  return await User.findOneAndUpdate(
    { _id: id },
    { status: status },
    { new: true, useFindAndModify: false }
  );
};