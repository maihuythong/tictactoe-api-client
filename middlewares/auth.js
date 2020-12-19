const passport = require('passport');
module.exports = passport.authenticate('jwt-auth', { session: false });