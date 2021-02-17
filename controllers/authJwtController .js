const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const promisify = require("es6-promisify");
const mail = require("../handlers/mail");

const Staff = mongoose.model("Staff");

require("dotenv").config({ path: ".variables.env" });

exports.register = async (req, res) => {
  try {
    let { email, password, passwordCheck, name } = req.body;

    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });

    const existingStaff = await Staff.findOne({ email: email });
    if (existingStaff)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    if (!name) name = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newStaff = new Staff({
      email,
      password: passwordHash,
      name,
    });
    const savedStaff = await newStaff.save();
    res.status(200).send({
      success: true,
      staff: {
        id: savedStaff._id,
        name: savedStaff.name,
        surname: savedStaff.surname,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const staff = await Staff.findOne({ email: email, removed: false });
    // console.log(staff);
    if (!staff)
      return res
        .status(400)
        .json({ error: "No account with this email has been registered." });

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials." });

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        id: staff._id,
      },
      process.env.JWT_SECRET
    );

    const result = await Staff.findOneAndUpdate(
      { _id: staff._id },
      { isLoggedIn: true },
      {
        new: true,
      }
    ).exec();

    res.json({
      token,
      staff: {
        id: result._id,
        name: result.name,
        isLoggedIn: result.isLoggedIn,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.user);
    res.json(deletedStaff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.tokenIsValid = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const staff = await Staff.findById(verified.id);
    if (!staff) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  console.log(req.user);

  const result = await Staff.findOneAndUpdate(
    { _id: req.user._id },
    { isLoggedIn: false },
    {
      new: true,
    }
  ).exec();

  res.status(200).json({ isLoggedIn: result.isLoggedIn });

  //     const token = req.header("x-auth-token");
  //     if (!token)
  //       return res
  //         .status(401)
  //         .json({ msg: "No authentication token, authorization denied." });

  //     const verified = jwt.verify(token, process.env.JWT_SECRET);
  //     if (!verified)
  //       return res
  //         .status(401)
  //         .json({ msg: "Token verification failed, authorization denied." });

  //     const staff = await Staff.findById(verified.id);
  //     if (!staff)
  //       return res
  //         .status(401)
  //         .json({ msg: "Staff doens't Exist, authorization denied." });
  //     else {
  //       req.user = staff;
  //       next();
  //     }

  // res.redirect("/login");
};

exports.isLoggedIn = (req, res, next) => {
  // first check if the staff is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on! They are logged in!
    return;
  }

  res.redirect("/login");
};

exports.forgot = async (req, res) => {
  // 1. See if a staff with that email exists
  const staff = await Staff.findOne({ email: req.body.email });
  if (!staff) {
    return res.send(_err.UNAUTHORIZED);
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

  // 4. inform the staff that, the email have been sent
  return res.send({
    status: true,
    message: "Reset link have been sent, please check your email.",
  });
};

exports.reset = async (req, res) => {
  const staff = await Staff.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!staff) {
    return res.send(_err.UNAUTHORIZED);
  }
  // if there is a staff, show the rest password form
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
  const staff = await Staff.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!staff) {
    return res.send(_err.UNAUTHORIZED);
  }

  const setPassword = promisify(staff.setPassword, staff);
  await setPassword(req.body.password);
  staff.resetPasswordToken = undefined;
  staff.resetPasswordExpires = undefined;
  const updatedStaff = await staff.save();
  await req.login(updatedStaff);

  return res.send(updatedStaff);
};

// router.get("/", auth, async (req, res) => {
//   const staff = await Staff.findById(req.user);
//   res.json({
//     name: staff.name,
//     id: staff._id,
//   });
// });

// module.exports = router;
