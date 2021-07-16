const { check } = require("express-validator");
const Admin = require("../models/Admin");

module.exports = [
  check("name").not().isEmpty(),
  check("email")
    .not()
    .isEmpty()
    .isString()
    .custom((value) => {
      return Admin.findOne({ email: value, removed: false }).then((c) => {
        if (c) {
          return Promise.reject("Email allready exists");
        }
      });
    }),
];
