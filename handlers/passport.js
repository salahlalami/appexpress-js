const passportJWT =  require('passport-jwt');
require("dotenv").config({ path: __dirname + "/../variables.env" });

// passport & jwt config
const {
  Strategy: JWTStrategy,
  ExtractJwt: ExtractJWT,
} = passportJWT;

// import User model
const User = require('../models/User')

// define passport jwt strategy
const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme(process.env.JWT_SCHEME);
opts.secretOrKey = process.env.JWT_SECRET_OR_KEY;
const passportJWTStrategy = new JWTStrategy(opts, function(jwtPayload, done) {
  // retrieve mail from jwt payload
  const email = jwtPayload.email;

  // if mail exist in database then authentication succeed
  User.findOne({email: email}, (error, user) => {
    if (error) {
      return done(error, false);
    } else {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    }
  });
});

// config passport
module.exports = function(passport) {
  // token strategy
  passport.use(passportJWTStrategy);

  // return configured passport
  return passport;
};