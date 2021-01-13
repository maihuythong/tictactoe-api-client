const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
    roomId: {
        type: Number,
        ref: "Room",
        required: true,
    },
    winLine: {
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
    winnerTurn: {
        type: String,
        default: 'O',
    },
    loser: {
        ref: "User",
        type: mongoose.ObjectId,
    },
    isDraw: {
        type: Boolean,
        default: false,
    }
});

const Match = mongoose.model("Matches", MatchSchema);

module.exports = Match;
