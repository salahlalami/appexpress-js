const passport = require("passport");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Staff = mongoose.model("Staff");
const promisify = require("es6-promisify");
const mail = require("../handlers/mail");

exports.login = passport.authenticate("local-login", {
  successRedirect: "/redirectafterlogin",
  failureRedirect: "/login", // redirect back to the signup page if there is an error

  failureFlash: true, // allow flash messages
});
exports.redirect = function (req, res) {
  setTimeout(() => {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }
    let staff = JSON.parse(JSON.stringify(req.user));
    if (req.body.remember) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
    } else {
      req.session.cookie.expires = false; // Cookie expires at end of session
    }

    switch (staff.role.dashboardType) {
      case "admin":
        return res.redirect("/staff");
      // break;
      case "doctor":
        return res.redirect("/patient");
      // break;
      case "secritary":
        return res.redirect("/appointment");
      // break;
      default:
        return res.redirect("/employee");
    }
  }, 500);
};

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You are now logged out! 👋");
  res.redirect("/login");
};

exports.checkAuth = (req, res, next) => {
  // first check if the staff is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on! They are logged in!
  } else {
    return res
      .status(401)
      .json({ error: "you must be logged in , authorization denied." });
  }
};

exports.isLoggedIn = (req, res, next) => {
  // first check if the staff is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on! They are logged in!
  } else {
    req.flash("error", "Oops you must be logged in to do that!");
    res.redirect("/login");
  }
};

exports.alreadyLoggedIn = (req, res, next) => {
  // first check if the staff is authenticated
  if (req.isAuthenticated()) {
    req.flash("info", "you are already LoggedIn");
    res.redirect("/"); // carry on! They are logged in!
  } else {
    next();
  }
};
exports.forgot = async (req, res) => {
  // 1. See if a staff with that email exists
  const staff = await Staff.findOne({ email: req.body.email });
  if (!staff) {
    req.flash("error", "No account with that email exists.");
    return res.redirect("/login");
  }
  // 2. Set reset tokens and expiry on their account
  staff.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  staff.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await staff.save();
  // 3. Send them an email with the token
  const resetURL = `http://${req.headers.host}/account/reset/${staff.resetPasswordToken}`;
  await mail.send({
    staff,
    filename: "password-reset",
    subject: "Password Reset",
    resetURL,
  });
  req.flash("success", `You have been emailed a password reset link.`);
  // 4. redirect to login page
  res.redirect("/login");
};

exports.reset = async (req, res) => {
  const staff = await Staff.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!staff) {
    req.flash("error", "Password reset is invalid or has expired");
    return res.redirect("/login");
  }
  // if there is a staff, show the rest password form
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
  const staff = await Staff.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!staff) {
    req.flash("error", "Password reset is invalid or has expired");
    return res.redirect("/login");
  }

  const setPassword = promisify(staff.setPassword, staff);
  await setPassword(req.body.password);
  staff.resetPasswordToken = undefined;
  staff.resetPasswordExpires = undefined;
  const updatedStaff = await staff.save();
  await req.login(updatedStaff);
  req.flash(
    "success",
    "💃 Nice! Your password has been reset! You are now logged in!"
  );
  res.redirect("/");
};
