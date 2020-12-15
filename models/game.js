const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { ErrorHandler } = require("../helpers/errorHandler");

const GameSchema = new mongoose.Schema({
  gameId: {
    type: Number,
    default: 0,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['playing', 'completed'],
    default: 'playing',
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
  history: {
    type: Array,
  },
});

GameSchema.plugin(AutoIncrement, {inc_field: 'gameId'});


const Game = mongoose.model("Games", GameSchema);

module.exports = Game;
