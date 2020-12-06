const express = require('express');
const router = express.Router();

const passport = require('passport');
const userController = require('../controllers/users');

router.post('/sign-up', userController.signup);
router.post('/sign-in', userController.signin);
router.get('/auth/google', userController.googleSignIn);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    let token = req.user.generateJWT(req.user.username);
    res.redirect(process.env.FRONT_END_URL + '/login?token=' + token);
  }
);

router.get('/auth/facebook', userController.facebookSignIn);
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

router.get('/me', userController.getme);
router.put('/me', userController.updateInfo);

module.exports = router;
