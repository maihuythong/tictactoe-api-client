const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const jwt_secret = require("../config/config");

let user = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    // required: true
  },
  email: {
    type: String,
    required: true
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
});

user.methods.generateJWT = (username) => {
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

user.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};

user.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", user);
