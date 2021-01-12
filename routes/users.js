const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/usersController');
const auth = require('../middlewares/auth');


router.post('/sign-up', usersController.signup);
router.post('/sign-in', usersController.signin);
router.put('/:id', usersController.updateUser);
router.get('/active-email/:token', usersController.activeAccount);
router.post('/resend-active-email', usersController.resendActiveAccount);
router.post('/forgot-password', usersController.forgotPassword);
router.post('/reset-password/:token', usersController.resetPassword);
router.get('/ranks', usersController.getRanks);

router.get('/auth/google', usersController.googleSignIn);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.FRONT_END_URL + '/login', }),
  function (req, res) {
    let token = req.user.generateJWT(req.user.username);
    res.redirect(process.env.FRONT_END_URL + '/login?token=' + token);
  }
);

router.get('/auth/facebook', usersController.facebookSignIn);
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: process.env.FRONT_END_URL + '/login',
  }),
  function (req, res) {
    let token = req.user.generateJWT(req.user.username);
    res.redirect(process.env.FRONT_END_URL + '/login?token=' + token);
  }
);

router.get('/me', auth, usersController.getMe);
router.put('/me', auth, usersController.updateInfo);

module.exports = router;
