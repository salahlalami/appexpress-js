const { check } = require('express-validator');
const User = require("../models/User");

module.exports = [
  check("_id")
    .not()
    .isEmpty()
    .isString()
    .custom((value) => {
      return User.findOne({ _id: value, removed: false }).then((c) => {
        if (!c) {
          return Promise.reject("User does not exist");
        }
      });
    }),
];
