const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const jwt_secret = require("../config/config");

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    // required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    default: "No Name",
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    default: "GUEST",
  },
  createdAt: {
    type: Date,
    // required: true,
    default: Date.now(),
  },
  modifiedAt: {
    type: Date,
  },
  avatar: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  facebook: {
    token: String,
    name: String,
    email: String,
  },
  googleId: {
    type: String,
  },
  google: {
    token: String,
    email: String,
    name: String,
  },
  status: {
    type: String,
    required: true,
    default: "offline",
  },
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
  win: {
    type: Number,
    default: 0,
    required: true,
  },
  lose: {
    type: Number,
    default: 0,
    required: true,
  },
  draw: {
    type: Number,
    default: 0,
    required: true,
  },
  cup: {
    type: Number,
    default: 0,
  },
  winRatio: {
    type: Number,
    default: 0,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    const res = doc.win - doc.lose;
    const winRatio =
      (doc.win / (doc.lose + doc.win === 0 ? 1 : doc.lose + doc.win)) * 100;
    const update = await this.model.updateOne(
      { _id: doc._id },
      { cup: res, winRatio: winRatio.toFixed(2) },
      { new: true }
    );

    if (update) {
      next();
    }
  }
});

UserSchema.methods.generateJWT = (username) => {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setMinutes(today.getMinutes() + 3600);

  return jwt.sign(
    {
      username: username,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    jwt_secret.secret
  );
};

UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
