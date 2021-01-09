const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
    roomId: {
        type: Number,
        ref: "Room",
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
    history: {
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
    isDraw: {
        type: mongoose.Boolean,
    }
});

const Match = mongoose.model("Matches", MatchSchema);

module.exports = Match;
