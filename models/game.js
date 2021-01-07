const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { ErrorHandler } = require("../helpers/errorHandler");
const bcrypt = require("bcrypt-nodejs");

const GameSchema = new mongoose.Schema({
  gameId: {
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
    enum: ["playing", "completed"],
    default: "playing",
  },
  host: {
    type: mongoose.ObjectId,
    required: true,
    ref: "User",
  },
  guest: {
    ref: "User",
    type: mongoose.ObjectId,
  },
  winner: {
    ref: "User",
    type: mongoose.ObjectId,
  },
  loser: {
    ref: "User",
    type: mongoose.ObjectId,
  },
  history: {
    type: Array,
    default: [],
  },
  winnerLine: {
    type: Array,
    default: [],
  },
});

GameSchema.plugin(AutoIncrement, { inc_field: "gameId" });
GameSchema.pre("save", async function (next) {
  // Hash the password with cost of 12
  if (this.password)
    this.password = await bcrypt.hashSync(
      this.password,
      bcrypt.genSaltSync(12),
      null
    );
  next();
});
GameSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Game = mongoose.model("Games", GameSchema);

module.exports = Game;
