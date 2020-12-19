const User = require("../models/user");
const passport = require("passport");
const { ErrorHandler } = require("../helpers/errorHandler");
const factoryController = require("./factoryController");
const catchAsync = require("../helpers/catchAsync");
const { signUpValidation, signInValidation } = require("../helpers/validation");


exports.signup = catchAsync(async(req, res, next) => {
  const { error } = await signUpValidation(req.body);
  if (error) return next(new ErrorHandler(400, error));
  return passport.authenticate(
    "local-signup",
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(new ErrorHandler(400, err));
      }

      if (passportUser) {
        return res.status(201).json({
          user: passportUser,
          token: passportUser.generateJWT(passportUser.username),
        });
      }
      return next(new ErrorHandler(400, info.message));
    }
  )(req, res, next);
});

exports.signin = catchAsync(async (req, res, next) => {
  const { error } = await signInValidation(req.body);
  if (error) return next(new ErrorHandler(400, error));
  return passport.authenticate(
    "local-signin",
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(new ErrorHandler(400, err));
      }

      if (passportUser) {
        return res.status(200).json({
          user: passportUser,
          token: passportUser.generateJWT(passportUser.username),
        });
      }

      return next(new ErrorHandler(400, info.message));
    }
  )(req, res, next);
});

exports.googleSignIn = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })(req, res, next);
};

exports.facebookSignIn = (req, res, next) => {
  passport.authenticate("facebook")(req, res, next);
};

exports.getUserFromToken = async (req, res, next) => {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(new ErrorHandler(400, err));
      }
      if (passportUser) {
        return res.status(200).json(
         {
           user: passportUser,
         }
        );
      }
      return next(new ErrorHandler(400, 'Please check if your token is valid and provide a good one'));
    }
  )(req, res, next);
};

exports.getMe = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};

exports.updateInfo = catchAsync( async (req, res, next) => {
  const { email, fullName, phone } = req.body;
  const doc = await User.findByIdAndUpdate(
    { _id: user._id },
    { email, phone, fullName },
    { new: true, runValidators: true }
  );
  if (!doc) return next(new ErrorHandler(404, 'No document found with that ID'));
  res.status(200).json({
    status: "success",
    user: doc,
  });
});


exports.getUser = factoryController.getOne(User);
exports.getAllUsers = factoryController.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factoryController.updateOne(User);
exports.deleteUser = factoryController.deleteOne(User);
