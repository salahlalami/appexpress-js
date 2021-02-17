const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Staff = mongoose.model("Staff");

require("dotenv").config({ path: ".variables.env" });

const auth = async (req, res, next) => {
  try {
    console.log(req.path);
    if (
      req.path == "/register" ||
      req.path == "/login" ||
      // req.path == "/public/*"
      req.path.search("/public/download") == 0
    ) {
      next();
    } else {
      const token = req.header("x-auth-token");
      if (!token)
        return res
          .status(401)
          .json({ error: "No authentication token, authorization denied." });

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified)
        return res
          .status(401)
          .json({ error: "Token verification failed, authorization denied." });

      const staff = await Staff.findOne({ _id: verified.id, removed: false });
      if (!staff)
        return res
          .status(401)
          .json({ error: "Staff doens't Exist, authorization denied." });

      if (staff.isLoggedIn === false)
        return res.status(401).json({
          error: "Staff is already logout try to login, authorization denied.",
        });
      else {
        req.user = staff;
        // console.log(req.user);
        next();
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = auth;
