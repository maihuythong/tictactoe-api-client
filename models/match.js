const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
    gameId: {
        type: Number,
        ref: "Game",
        required: true,
        unique: true,
    },
    winnerLine: {
        type: Array,
        default: [],
    },
    messages: {
        type: Array,
        default: [],
    },
    histories: {
        type: Array,
        default: [],
    },
    winner: {
        ref: "User",
        type: mongoose.ObjectId,
    },
    loser: {
        ref: "User",
        type: mongoose.ObjectId,
    },
});

const Match = mongoose.model("Matches", MatchSchema);

module.exports = Match;
