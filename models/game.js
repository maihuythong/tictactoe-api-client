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

// GameSchema.pre("save", async function preSave(next) {
//   // const doc = this;
//   // console.log('123123' + doc);
//   const doc = this;
//   console.log(123123123132);
//   console.log(doc);
//   //   Game.findByIdAndUpdate({_id: 'entityId'}, {$inc: { gameId: 1} }, function(error, game)   {
//   //     if(error)
//   //         return next(error);
//   //     doc.testvalue = game.gameId;
//   //     next();
//   // });
//   if (doc.isNew) {
//     const currentId = await Game.find({})
//                           .sort({"gameId" : -1})
//                           .limit(1)
//                           .exec( async function(err, doc){
//                             if(doc) {
//                               console.log(doc);
//                               const res = await Game.findByIdAndUpdate(
//                                 { _id: doc._id },
//                                 { gameId: doc.gameId + 1 },
//                                 { new: true, upsert: true }
//                               );
//                               if (res) next();
//                               else new ErrorHandler(400, "Can't create new game! Please try again!");
//                             }
//                           });
//   }
// });

module.exports = Game;
