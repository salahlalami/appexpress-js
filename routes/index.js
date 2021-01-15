const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const appController = require("../controllers/appController");

router.get("/login", appController.login);
router.get("/", appController.dashboard);

router.route("/login").post(authController.login, authController.redirect);

module.exports = router;
