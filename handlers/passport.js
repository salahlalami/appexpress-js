// load all the things we need
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var TwitterStrategy = require("passport-twitter").Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

// load up the staff model
const mongoose = require("mongoose");
let Staff = mongoose.model("Staff");

// load the auth variables
var configAuth = require("./auth"); // use this one for testing

module.exports = function (passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize staffs out of session

  // used to serialize the staff for the session
  passport.serializeUser(function (staff, done) {
    done(null, staff.id);
  });

  // used to deserialize the staff
  passport.deserializeUser(function (id, done) {
    Staff.findById(id, function (err, staff) {
      done(err, staff);
    });
  });

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        // by default, local strategy uses staffname and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a staff is logged in or not)
      },
      function (req, email, password, done) {
        if (email) email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function () {
          Staff.findOne({ email: email, removed: false }, function (
            err,
            staff
          ) {
            // if there are any errors, return the error
            if (err) return done(err);

            // if no staff is found, return the message
            if (!staff)
              return done(null, false, req.flash("error", "No staff found."));

            if (!staff.validPassword(password))
              return done(
                null,
                false,
                req.flash("error", "Oops! Wrong password.")
              );
            // all is well, return staff
            else return done(null, staff);
          });
        });
      }
    )
  );

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        // by default, local strategy uses staffname and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a staff is logged in or not)
      },
      function (req, email, password, done) {
        if (email) email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function () {
          // if the staff is not already logged in:
          if (!req.user) {
            Staff.findOne({ "local.email": email }, function (err, staff) {
              // if there are any errors, return the error
              if (err) return done(err);

              // check to see if theres already a staff with that email
              if (staff) {
                return done(
                  null,
                  false,
                  req.flash("signupMessage", "That email is already taken.")
                );
              } else {
                // create the staff
                var newStaff = new Staff();

                newStaff.local.email = email;
                newStaff.local.password = newStaff.generateHash(password);

                newStaff.save(function (err) {
                  if (err) return done(err);

                  return done(null, newStaff);
                });
              }
            });
            // if the staff is logged in but has no local account...
          } else if (!req.user.local.email) {
            // ...presumably they're trying to connect a local account
            // BUT let's check if the email used to connect a local account is being used by another staff
            Staff.findOne({ "local.email": email }, function (err, staff) {
              if (err) return done(err);

              if (staff) {
                return done(
                  null,
                  false,
                  req.flash("loginMessage", "That email is already taken.")
                );
                // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
              } else {
                var staff = req.user;
                staff.local.email = email;
                staff.local.password = staff.generateHash(password);
                staff.save(function (err) {
                  if (err) return done(err);

                  return done(null, staff);
                });
              }
            });
          } else {
            // staff is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, staff!)
            return done(null, req.user);
          }
        });
      }
    )
  );

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  var fbStrategy = configAuth.facebookAuth;
  fbStrategy.passReqToCallback = true; // allows us to pass in the req from our route (lets us check if a staff is logged in or not)
  passport.use(
    new FacebookStrategy(fbStrategy, function (
      req,
      token,
      refreshToken,
      profile,
      done
    ) {
      // asynchronous
      process.nextTick(function () {
        // check if the staff is already logged in
        if (!req.user) {
          Staff.findOne({ "facebook.id": profile.id }, function (err, staff) {
            if (err) return done(err);

            if (staff) {
              // if there is a staff id already but no token (staff was linked at one point and then removed)
              if (!staff.facebook.token) {
                staff.facebook.token = token;
                staff.facebook.name =
                  profile.name.givenName + " " + profile.name.familyName;
                staff.facebook.email = (
                  profile.emails[0].value || ""
                ).toLowerCase();

                staff.save(function (err) {
                  if (err) return done(err);

                  return done(null, staff);
                });
              }

              return done(null, staff); // staff found, return that staff
            } else {
              // if there is no staff, create them
              var newStaff = new Staff();

              newStaff.facebook.id = profile.id;
              newStaff.facebook.token = token;
              newStaff.facebook.name =
                profile.name.givenName + " " + profile.name.familyName;
              newStaff.facebook.email = (
                profile.emails[0].value || ""
              ).toLowerCase();

              newStaff.save(function (err) {
                if (err) return done(err);

                return done(null, newStaff);
              });
            }
          });
        } else {
          // staff already exists and is logged in, we have to link accounts
          var staff = req.user; // pull the staff out of the session

          staff.facebook.id = profile.id;
          staff.facebook.token = token;
          staff.facebook.name =
            profile.name.givenName + " " + profile.name.familyName;
          staff.facebook.email = (profile.emails[0].value || "").toLowerCase();

          staff.save(function (err) {
            if (err) return done(err);

            return done(null, staff);
          });
        }
      });
    })
  );

  // =========================================================================
  // TWITTER =================================================================
  // =========================================================================
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL,
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a staff is logged in or not)
      },
      function (req, token, tokenSecret, profile, done) {
        // asynchronous
        process.nextTick(function () {
          // check if the staff is already logged in
          if (!req.user) {
            Staff.findOne({ "twitter.id": profile.id }, function (err, staff) {
              if (err) return done(err);

              if (staff) {
                // if there is a staff id already but no token (staff was linked at one point and then removed)
                if (!staff.twitter.token) {
                  staff.twitter.token = token;
                  staff.twitter.staffname = profile.staffname;
                  staff.twitter.displayName = profile.displayName;

                  staff.save(function (err) {
                    if (err) return done(err);

                    return done(null, staff);
                  });
                }

                return done(null, staff); // staff found, return that staff
              } else {
                // if there is no staff, create them
                var newStaff = new Staff();

                newStaff.twitter.id = profile.id;
                newStaff.twitter.token = token;
                newStaff.twitter.staffname = profile.staffname;
                newStaff.twitter.displayName = profile.displayName;

                newStaff.save(function (err) {
                  if (err) return done(err);

                  return done(null, newStaff);
                });
              }
            });
          } else {
            // staff already exists and is logged in, we have to link accounts
            var staff = req.user; // pull the staff out of the session

            staff.twitter.id = profile.id;
            staff.twitter.token = token;
            staff.twitter.staffname = profile.staffname;
            staff.twitter.displayName = profile.displayName;

            staff.save(function (err) {
              if (err) return done(err);

              return done(null, staff);
            });
          }
        });
      }
    )
  );

  // =========================================================================
  // GOOGLE ==================================================================
  // =========================================================================
  passport.use(
    new GoogleStrategy(
      {
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a staff is logged in or not)
      },
      function (req, token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function () {
          // check if the staff is already logged in
          if (!req.user) {
            Staff.findOne({ "google.id": profile.id }, function (err, staff) {
              if (err) return done(err);

              if (staff) {
                // if there is a staff id already but no token (staff was linked at one point and then removed)
                if (!staff.google.token) {
                  staff.google.token = token;
                  staff.google.name = profile.displayName;
                  staff.google.email = (
                    profile.emails[0].value || ""
                  ).toLowerCase(); // pull the first email

                  staff.save(function (err) {
                    if (err) return done(err);

                    return done(null, staff);
                  });
                }

                return done(null, staff);
              } else {
                var newStaff = new Staff();

                newStaff.google.id = profile.id;
                newStaff.google.token = token;
                newStaff.google.name = profile.displayName;
                newStaff.google.email = (
                  profile.emails[0].value || ""
                ).toLowerCase(); // pull the first email

                newStaff.save(function (err) {
                  if (err) return done(err);

                  return done(null, newStaff);
                });
              }
            });
          } else {
            // staff already exists and is logged in, we have to link accounts
            var staff = req.user; // pull the staff out of the session

            staff.google.id = profile.id;
            staff.google.token = token;
            staff.google.name = profile.displayName;
            staff.google.email = (profile.emails[0].value || "").toLowerCase(); // pull the first email

            staff.save(function (err) {
              if (err) return done(err);

              return done(null, staff);
            });
          }
        });
      }
    )
  );
};
