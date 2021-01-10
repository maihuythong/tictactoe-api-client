const User = require("../models/user");
const passport = require("passport");
const { ErrorHandler } = require("../helpers/errorHandler");
const factoryController = require("./factoryController");
const catchAsync = require("../helpers/catchAsync");
const { signUpValidation, signInValidation, passwordValidation, emailValidation } = require("../helpers/validation");
const Email = require("./../helpers/email");
const { verifyToken } = require("../helpers/tokenUtils");

exports.signup = catchAsync(async (req, res, next) => {
  const { error } = await signUpValidation(req.body);
  if (error) return next(new ErrorHandler(400, error));
  return passport.authenticate(
    "local-signup",
    { session: false },
    async (err, passportUser, info) => {
      if (err) {
        return next(new ErrorHandler(400, err));
      }

      if (passportUser) {
        const token = passportUser.generateJWT(passportUser.username);
        const url = `${process.env.SERVER_URL_LOCAL}/users/active-email/${token}`;
        await new Email(passportUser, url).sendWelcome();
        return res.status(201).json({
          status: "success",
          body: {
            message: "Please visit your email to active account!",
          },
          // user: passportUser,
          // token: passportUser.generateJWT(passportUser.username),
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
    "jwt",
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(new ErrorHandler(400, err));
      }
      if (passportUser) {
        return res.status(200).json({
          user: passportUser,
        });
      }
      return next(
        new ErrorHandler(
          400,
          "Please check if your token is valid and provide a good one"
        )
      );
    }
  )(req, res, next);
};

exports.getMe = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};

exports.updateInfo = catchAsync(async (req, res, next) => {
  const { email, fullName, phone } = req.body;
  const doc = await User.findByIdAndUpdate(
    { _id: user._id },
    { email, phone, fullName },
    { new: true, runValidators: true }
  );
  if (!doc)
    return next(new ErrorHandler(404, "No document found with that ID"));
  res.status(200).json({
    status: "success",
    user: doc,
  });
});

exports.activeAccount = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const decodedToken = verifyToken(token);
  if (decodedToken) {
    const username = decodedToken.username;
    const doc = await User.findOneAndUpdate(
      { username: username },
      { active: true },
      { new: true }
    );
    if (doc) {
      res.redirect(
        `${process.env.FRONT_END_URL_LOCAL}/active-email/?status=success&username=${username}`
      );
    } else {
      next(new ErrorHandler(400, "Authentication failed!"));
    }
  } else {
    res.redirect(
      `${process.env.FRONT_END_URL_LOCAL}/active-email/?status=expired`
    );
  }
});

exports.resendActiveAccount = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const doc = await User.findOne({ email: email, active: false });
  if (doc) {
    const token = doc.generateJWT(doc.username);
    const url = `${process.env.SERVER_URL_LOCAL}/users/active-email/${token}`;
    await new Email(doc, url).sendWelcome();
    return res.status(200).json({
      status: "success",
      body: {
        message: "Please visit your email to active account!",
      },
    });
  } else {
    next(new ErrorHandler(400, "Can't find account with this email! Please try again!"));
  }
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { error } = await emailValidation(req.body);
  if (error) return next(new ErrorHandler(400, error));
  const email = req.body.email;
  const doc = await User.findOne({ email: email, active: true });
  if (doc) {
    const token = doc.generateJWT(doc.username);
    const url = `${process.env.FRONT_END_URL_LOCAL}/reset-password/?token=${token}`;
    await new Email(doc, url).sendPasswordReset();
    return res.status(200).json({
      status: "success",
      body: {
        message: "Please visit your email to active account!",
      },
    });
  } else {
    next(new ErrorHandler(400, "Can't find account with this email! Please try again!"));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { error } = await passwordValidation(req.body);
  if (error) return next(new ErrorHandler(400, error));
  const token = req.params.token;
  const password = req.body.password;
  const decodedToken = verifyToken(token);
  if(!decodedToken){
    return next(new ErrorHandler(400, "Invalid token"));
  }
  const doc = await User.findOne({ username: decodedToken.username, active: true });
  if (doc) {
    const newUser = new User();
    const newPassword = newUser.generateHash(password);
    const docRes = await User.findOneAndUpdate({username: doc.username},{ password: newPassword}, {new: true});
    if(docRes) {
      return res.status(200).json({
        status: "success",
        body: {
          message: "Update password success!",
        },
      });
    }else{
      next(new ErrorHandler(400, "Can't update password! Please try again!"))
    }
  } else {
    next(new ErrorHandler(400, "Can't find account with this email! Please try again!"));
  }
});

exports.getUser = factoryController.getOne(User);
exports.getAllUsers = factoryController.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factoryController.updateOne(User);
exports.deleteUser = factoryController.deleteOne(User);
