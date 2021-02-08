const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const appController = require("../controllers/appController");
const { catchErrors } = require("../handlers/errorHandlers");
const {
  isLoggedIn,
  alreadyLoggedIn,
  login,
  redirect,
} = require("../controllers/authController");

router.route("/login").get(alreadyLoggedIn, appController.login);
router.route("/login").post(catchErrors(login, redirect));

router
  .route("/logout")
  .post(isLoggedIn, catchErrors(authController.logout))
  .get(isLoggedIn, catchErrors(authController.logout));

router.route("/").get(isLoggedIn, appController.dashboard);

router.get("/dashboardDoctor", appController.dashboardDoctor);
router.get("/dashboardSecretariat", appController.dashboardSecretariat);
router.get("/account", appController.account);
router.get("/user", appController.user);
router.get("/role", appController.role);
router.get("/permission", appController.permission);
router.get("/patient", appController.patient);
router.get("/employee", appController.employee);
router.get("/department", appController.department);
router.get("/position", appController.position);
router.get("/appointment", appController.appointment);
router.get("/doctor", appController.doctor);
router.get("/medicament", appController.medicament);
router.get("/laboratory", appController.laboratory);
router.get("/specialty", appController.specialty);
router.get("/analysisType", appController.analysisType);
router.get("/client", appController.client);
router.get("/clientPayment", appController.clientPayment);
router.get("/consultationType", appController.consultationType);
router.get("/currency", appController.currency);
router.get("/expense", appController.expense);
router.get("/expenseCategory", appController.expenseCategory);
router.get("/invoice", appController.invoice);
router.get("/item", appController.item);
router.get("/mriScan", appController.mriScan);
router.get("/mriScanType", appController.mriScanType);
router.get("/orderForm", appController.orderForm);
router.get("/payment", appController.payment);
router.get("/paymentMode", appController.paymentMode);
router.get("/prescription", appController.prescription);
router.get("/quote", appController.quote);
router.get("/supplier", appController.supplier);
router.get("/settingGlobal", appController.settingGlobal);
router.get("/settingMedical", appController.settingMedical);
router.get("/settingCommercial", appController.settingCommercial);
router.get(
  "/consultation/:doctorParam?",
  catchErrors(appController.consultation)
);
router.get("/task", catchErrors(appController.task));
router.get("/customMenu", catchErrors(appController.customMenu));
//______________________________________________________________________________________

// Download pdf file
router.get("/public/download/:pdfname?", appController.download);

//_________________________________________________________________________________________;
// // Download pdf file
router.route("/public/download/:pdfname?").get(appController.download);
module.exports = router;
