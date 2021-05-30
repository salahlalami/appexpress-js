const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const User = mongoose.model("User");

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

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    if (!name) name = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      name,
    });
    const savedUser = await newUser.save();
    res.status(200).send({
      success: true,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        surname: savedUser.surname,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      result: null,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const user = await User.findOne({ email: email, removed: false });
    // console.log(user);
    if (!user)
      return res.status(400).json({
        success: false,
        result: null,
        message: "No account with this email has been registered.",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        result: null,
        message: "Invalid credentials.",
      });

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        id: user._id,
      },
      process.env.JWT_SECRET
    );

    const result = await User.findOneAndUpdate(
      { _id: user._id },
      { isLoggedIn: true },
      {
        new: true,
      }
    ).exec();

    res.json({
      success: true,
      result: {
        token,
        user: {
          id: result._id,
          name: result.name,
          isLoggedIn: result.isLoggedIn,
        },
      },
      message: "Successfully login user",
    });
  } catch (err) {
    // res.status(500).json({ success: false, result:null, message: err.message });
    res
      .status(500)
      .json({ success: false, result: null, message: err.message });
  }
};

exports.isValidToken = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({
        success: false,
        result: null,
        message: "No authentication token, authorization denied.",
        jwtExpired: true,
      });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Token verification failed, authorization denied.",
        jwtExpired: true,
      });

    const user = await User.findOne({ _id: verified.id, removed: false });
    if (!user)
      return res.status(401).json({
        success: false,
        result: null,
        message: "User doens't Exist, authorization denied.",
        jwtExpired: true,
      });

    if (user.isLoggedIn === false)
      return res.status(401).json({
        success: false,
        result: null,
        message: "User is already logout try to login, authorization denied.",
        jwtExpired: true,
      });
    else {
      req.user = user;
      // console.log(req.user);
      next();
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      result: null,
      message: err.message,
      jwtExpired: true,
    });
  }
};

exports.logout = async (req, res) => {
  const result = await User.findOneAndUpdate(
    { _id: req.user._id },
    { isLoggedIn: false },
    {
      new: true,
    }
  ).exec();

  res.status(200).json({ isLoggedIn: result.isLoggedIn });
};
