const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const appController = require("../controllers/appController");
const { isLoggedIn } = require("../controllers/authController");

router.route("/login").get(appController.login);
router.get("/", isLoggedIn, appController.dashboard);

router.route("/login").post(authController.login, authController.redirect);

module.exports = router;
