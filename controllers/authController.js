const passport = require("passport");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const promisify = require("es6-promisify");
const mail = require("../handlers/mail");

exports.login = passport.authenticate("local-login", {
  failureRedirect: "/login", // redirect back to the signup page if there is an error
  failureFlash: true, // allow flash messages
});
exports.redirect = function (req, res) {
  let user = JSON.parse(JSON.stringify(req.user));
  console.log(user);
  if (req.body.remember) {
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
  } else {
    req.session.cookie.expires = false; // Cookie expires at end of session
  }

  switch (user.dashbaordType) {
    case "admin":
      return res.redirect("/admindashboard");
    // break;
    case "doctor":
      return res.redirect("/dootordashboard");
    // break;
    case "secritary":
      return res.redirect("/secritarydashboard");
    // break;
    default:
      return res.redirect("/");
  }
};

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You are now logged out! 👋");
  res.redirect("/login");
};

exports.checkAuth = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on! They are logged in!
  } else {
    return res
      .status(401)
      .json({ error: "you must be logged in , authorization denied." });
  }
};

exports.isLoggedIn = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on! They are logged in!
  } else {
    req.flash("error", "Oops you must be logged in to do that!");
    res.redirect("/login");
  }
};

exports.alreadyLoggedIn = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    req.flash("info", "you are already LoggedIn");
    res.redirect("/"); // carry on! They are logged in!
  } else {
    next();
  }
};
exports.forgot = async (req, res) => {
  // 1. See if a user with that email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash("error", "No account with that email exists.");
    return res.redirect("/login");
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
  req.flash("success", `You have been emailed a password reset link.`);
  // 4. redirect to login page
  res.redirect("/login");
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    req.flash("error", "Password reset is invalid or has expired");
    return res.redirect("/login");
  }
  // if there is a user, show the rest password form
  res.render("reset", { title: "Reset your Password" });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body["password-confirm"]) {
    next(); // keepit going!
    return;
  }
  req.flash("error", "Passwords do not match!");
  res.redirect("back");
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", "Password reset is invalid or has expired");
    return res.redirect("/login");
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash(
    "success",
    "💃 Nice! Your password has been reset! You are now logged in!"
  );
  res.redirect("/");
};
