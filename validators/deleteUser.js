const { check } = require("express-validator");
const Admin = require("../models/Admin");

module.exports = [
  check("_id")
    .not()
    .isEmpty()
    .isString()
    .custom((value) => {
      return Admin.findOne({ _id: value, removed: false }).then((c) => {
        if (!c) {
          return Promise.reject("Admin does not exist");
        }
      });
    }),
];
