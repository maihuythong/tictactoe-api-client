const mongoose = require('mongoose');
module.exports = mongoose.model(
  'Board',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.ObjectId,
      required: true, // enable when complete authentication
      ref: 'User',
    },
    member: [
      {
        user: {
          type: mongoose.ObjectId,
          ref: 'User',
        },
        joinedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    modifiedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  }),
  'Boards'
);
