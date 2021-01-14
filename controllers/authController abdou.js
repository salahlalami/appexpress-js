const passport = require("passport");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const promisify = require("es6-promisify");
const mail = require("../handlers/mail");
const UserController = require("./userController");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".variables.env" });
const _err = require("../errors/main");

exports.login = (request, response, next) => {
  const email = request.body.email || "";
  const password = request.body.password || "";

  if (email && password) {
    let query = User.findOne({ email: email, removed: false });

    query.exec((error, user) => {
      // check if user exist
      if (error) {
        response.status(401).send({
          success: false,
          message: error.message,
        });
      } else {
        if (!user) {
          response.status(401).send({
            success: false,
            message: "User does not exist",
          });
        } else {
          // check if password matches
          user.comparePassword(password, (error, isMatch) => {
            if (isMatch && !error) {
              // if user is found and password is right create a token
              // algorithm: process.env.JWT_TOKEN_HASH_ALGO
              const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_TOKEN_EXPIRATION,
              });

              let tmp_user = {
                _id: user._id,
                email: user.email,
                name: user.name,
              };

              // return the information including token as JSON
              response.status(200).send({
                success: true,
                user: tmp_user,
                token: `${process.env.JWT_TOKEN_PREFIX} ${token}`,
              });
            } else {
              response.status(401).send({
                success: false,
                message: "Wrong password",
              });
            }
          });
        }
      }
    });
  } else {
    return response.status(401).send({
      success: false,
      message: "Missing password or email",
    });
  }
};

exports.logout = (req, res) => {
  req.logout();

  res.redirect("/");
};

exports.isLoggedIn = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on! They are logged in!
    return;
  }

  res.redirect("/login");
};

exports.forgot = async (req, res) => {
  // 1. See if a user with that email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.send(_err.UNAUTHORIZED);
  }
  // 2. Set reset tokens and expiry on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await user.save();
  // 3. Send them an email with the token
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  await mail.send({
    user,
    filename: "password-reset",
    subject: "Password Reset",
    resetURL,
  });

  // 4. inform the user that, the email have been sent
  return res.send({
    status: true,
    message: "Reset link have been sent, please check your email.",
  });
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.send(_err.UNAUTHORIZED);
  }
  // if there is a user, show the rest password form
  return res.send({
    status: false,
    message: "Reset your Password",
  });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body["password-confirm"]) {
    next(); // keepit going!
    return;
  }

  res.redirect("back");
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.send(_err.UNAUTHORIZED);
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);

  return res.send(updatedUser);
};
