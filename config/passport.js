const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy,
  jwt_secret = require('./config');
const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, username, password, done) => {
        process.nextTick(() => {
          User.findOne({ username: username }, (err, user) => {
            if (err) return done(err);

            if (user) {
              return done(null, false, {
                message: 'That username is already taken.',
              });
            } else {
              let newUser = new User();

              newUser.username = username;
              newUser.password = newUser.generateHash(password);
              newUser.fullName = req.body.fullName;
              newUser.email = req.body.email;
              newUser.active = false;
              newUser.save((err) => {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  passport.use(
    'local-signin',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
          if (err) return done(err);

          if (!user)
            return done(null, false, { message: 'Incorrect username.' });

          if (!user.validPassword(password))
            return done(null, false, { message: 'Incorrect password.' });

          return done(null, user);
        });
      }
    )
  );

  // Passport JWT Strategy
  passport.use(
    'jwt-auth',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwt_secret.secret,
      },
      (jwt_payload, done) => {
        User.findOne({ username: jwt_payload.username }, (err, user) => {
          if (err) return done(err);

          if (user) {
            return done(null, user, {
              message: 'A user was found thanks to the jwt token',
            });
          } else {
            return done(null, false, {
              message: 'No user was found thanks to the jwt token',
            });
          }
        });
      }
    )
  );

  // Passport Facebook Strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        // callbackURL:
        //   'http://localhost:8080/api/v1/users/auth/facebook/callback',
        profileFields: ['id', 'emails', 'name'],
      },
      (token, refreshToken, profile, done) => {

        process.nextTick(() => {
          User.findOne({ facebookId: profile.id }, (err, user) => {
            if (err) return done(err);
            if (user) {
              return done(null, user);
            } else {
              let newUser = new User();
              newUser.username = profile.id;
              newUser.facebookId = profile.id;
              newUser.facebook.token = token;
              newUser.facebook.name =
                profile.name.givenName + ' ' + profile.name.familyName;
              newUser.fullName =
                profile.name.givenName + ' ' + profile.name.familyName;
              // newUser.facebook.email = profile.emails[0].value;

              newUser.save((err) => {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
          User.findOne({ username: profile.id }, (err, user) => {
            if (err) return done(err);

            if (user) {
              return done(null, user);
            } else {
              let newUser = new User();
              newUser.username = profile.id;
              newUser.google.token = accessToken;
              newUser.google.name = profile.displayName;
              newUser.google.email = profile.emails[0].value;
              newUser.fullName = profile.displayName;

              newUser.save((err) => {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );
};
