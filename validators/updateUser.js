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
  check("name").not().isEmpty(),
  check("email")
    .not()
    .isEmpty()
    .isString()
    .custom((value, { req }) => {
      return Admin.findOne({
        email: value,
        removed: false,
        _id: { $ne: req.body._id },
      }).then((c) => {
        if (c) {
          return Promise.reject("Email allready exists");
        }
      });
    }),
];
