require("dotenv").config({ path: ".variables.env" });
const jwt = require("jsonwebtoken");

const isValidToken = (token) => {
  try {
    let staff = jwt.verify(token, process.env.JWT_SECRET);

    return {
      status: true,
      data: staff,
    };
  } catch (error) {
    console.log(error);
    // error
    return {
      status: false,
      result: null,
    };
  }
};

/**
 * retrieve token from header
 * @param {*} headers
 * @return {string} token or null
 */
const retrieveToken = (headers) => {
  if (headers && headers.authorization) {
    const tokens = headers.authorization.split(" ");
    if (tokens && tokens.length === 2) {
      return tokens[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = (req, res, next) => {
  let staff;

  let token = retrieveToken(req.headers);

  if (token) {
    staff = isValidToken(token);
    if (staff.status) {
      req.user = staff.data;
    }
  }

  // only register && public/download  routes will be allowed to get pass :)

  // he we check if the the staff collection exist in the request
  // if yes means that the staff is logged in
  // else the staff is not logged it
  console.log(req.user);
  if (
    req.user == undefined &&
    req.path !== "/register" &&
    req.path !== "/login" &&
    req.path.search("/public/download") !== 0
  ) {
    // redirect to login page if the staff is not logged in :')
    return res.send({
      status: false,
      path: req.path,
      message: "CheckStaff.js Unauthorized",
    });
  } else {
    console.log("next()");
  }

  // if yes continue the staff actions ^_^
  next();
};
