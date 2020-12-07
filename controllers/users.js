const User = require('../models/user');
const passport = require('passport');
const { ErrorHandler } = require('../helpers/errorHandler');

module.exports.signup = (req, res, next) => {
  passport.authenticate(
    'local-signup',
    { session: false },
    (err, passportUser, info) => {
      if (err) return res.json({ errors: err });

      if (passportUser) {
        return res.json({
          user: passportUser,
          token: passportUser.generateJWT(passportUser.username),
        });
      }
      console.log(info.message);

      // return res.status(400).json({ data: info.message });
      // res.send(info.message);
      res.send({ err: '400', message: info.message });
      // return res.status(400);
    }
  )(req, res, next);
};

module.exports.signin = (req, res, next) => {
  passport.authenticate(
    'local-signin',
    { session: false },
    (err, passportUser, info) => {
      if (err) return res.json({ errors: err });

      if (passportUser) {
        console.log(passportUser);

        return res.json({
          user: passportUser,
          token: passportUser.generateJWT(passportUser.username),
        });
      }

      res.send({ err: '400', message: info.message });
    }
  )(req, res, next);
};

module.exports.googleSignIn = (req, res, next) => {
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })(req, res, next);
};

module.exports.facebookSignIn = (req, res, next) => {
  passport.authenticate('facebook')(req, res, next);
};

module.exports.getme = async (req, res, next) => {
  const user = await User.findOne({ _id: req.userData.id });
  console.log(user);

  if (user) {
    res.status(200).json(user);
  } else {
    next(new ErrorHandler(404, 'Error user!'));
  }
};

module.exports.updateInfo = async (req, res, next) => {
  const user = await User.findOne({ _id: req.userData.id });
  if (user) {
    const { email, fullname, phone } = req.body;
    const doc = await User.findByIdAndUpdate(
      { _id: user._id },
      { email, phone, fullname },
      { new: true }
    );
    res.status(200).json(doc);
  } else {
    next(new ErrorHandler(404, 'Error user!'));
  }
};
