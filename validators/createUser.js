const { check } = require('express-validator');
const User = require("../models/User");

module.exports = [
  check("name").not().isEmpty(),
  check("email")
    .not()
    .isEmpty()
    .isString()
    .custom((value) => {
      return User.findOne({ email: value, removed: false }).then((c) => {
        if (c) {
          return Promise.reject("Email allready exists");
        }
      });
    }),
];
