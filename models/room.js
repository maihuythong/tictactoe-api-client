const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt-nodejs");

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: Number,
    default: 0,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: "Caro VN",
  },
  password: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ["waiting player", "playing", "completed"],
    default: "waiting player",
  },
  creator: {
    type: mongoose.ObjectId,
    required: true,
    ref: "User",
  },
  viewers: {
    type: Array,
  }
});

RoomSchema.plugin(AutoIncrement, { inc_field: "roomId" });
RoomSchema.pre("save", async function (next) {
  // Hash the password with cost of 12
  if (this.password)
    this.password = await bcrypt.hashSync(
      this.password,
      bcrypt.genSaltSync(12),
      null
    );
  next();
});
RoomSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Room = mongoose.model("Rooms", RoomSchema);

module.exports = Room;
