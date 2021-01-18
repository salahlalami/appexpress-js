const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const appController = require("../controllers/appController");
const { catchErrors } = require("../handlers/errorHandlers");
const {
  isLoggedIn,
  alreadyLoggedIn,
} = require("../controllers/authController");

router.route("/login").get(alreadyLoggedIn, appController.login);
router
  .route("/logout")
  .post(isLoggedIn, catchErrors(authController.logout))
  .get(isLoggedIn, catchErrors(authController.logout));

router.route("/").get(isLoggedIn, appController.dashboard);

router.route("/login").post(authController.login, authController.redirect);

//_________________________________________________________________________________________;
// // Download pdf file
router.route("/public/download/:pdfname?").get(appController.download);
module.exports = router;
