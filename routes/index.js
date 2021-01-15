const express = require("express");
const multer = require("multer");
const path = require("path");
const setFilePathToBody = require("../middlewares/setFilePathToBody");
const { catchErrors } = require("../handlers/errorHandlers");

const router = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const appController = require("../controllers/appController");
const accountController = require("../controllers/accountController");
const patientController = require("../controllers/patientController");
const employeeController = require("../controllers/employeeController");
const departmentController = require("../controllers/departmentController");
const specialtyController = require("../controllers/specialtyController");
const positionController = require("../controllers/positionController");
const appointmentController = require("../controllers/appointmentController");
const doctorController = require("../controllers/doctorController");
const medicamentController = require("../controllers/medicamentController");
const consultationController = require("../controllers/consultationController");
const laboratoryConsultationController = require("../controllers/laboratoryConsultationController");
const currencyController = require("../controllers/currencyController");
const prescriptionController = require("../controllers/prescriptionController");
const paymentController = require("../controllers/paymentController");
const paymentModeController = require("../controllers/paymentModeController");
const analysisController = require("../controllers/analysisController");
const analysisTypeController = require("../controllers/analysisTypeController");
const mriScanController = require("../controllers/mriScanController");
const mriScanTypeController = require("../controllers/mriScanTypeController");
const clientController = require("../controllers/clientController");
// const invoiceController = require("../controllers/invoiceController");
const itemController = require("../controllers/itemController");
const quoteController = require("../controllers/quoteController");
const supplierController = require("../controllers/supplierController");
const orderFormController = require("../controllers/orderFormController");
const expenseController = require("../controllers/expenseController");
const expenseCategoryController = require("../controllers/expenseCategoryController");
const clientPaymentController = require("../controllers/clientPaymentController");
const consultationTypeController = require("../controllers/consultationTypeController");
const consultationRecordingController = require("../controllers/consultationRecordingController");

const settingCommercialController = require("../controllers/settingCommercialController");
const settingMedicalController = require("../controllers/settingMedicalController");
const settingGlobalController = require("../controllers/settingGlobalController");
const taskController = require("../controllers/taskController");
const recordAudioController = require("../controllers/recordAudioController");
const customMenuController = require("../controllers/customMenuController");

const uploadController = require("../controllers/uploadController");

//multer object creation
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

const roleController = require("../controllers/roleController");
const permissionController = require("../controllers/permissionController");

// Middlewares_______________________________________________________________________
const permissionMiddleware = require("../middlewares/permissionMiddleware");
// const settingMiddleware = require("../middlewares/settingMiddleware");

//checking if user is logged it or not !!

const createUser = require("../validators/createUser");
const updateUser = require("../validators/updateUser");
const deleteUser = require("../validators/deleteUser");
const validateBody = require("../Helpers/validateBody");

// const checkUser = require("../middlewares/checkUser");
// router
//   .route("/*")
//   .get(checkUser)
//   .post(checkUser)
//   .put(checkUser)
//   .delete(checkUser);
router.get("/login", appController.login);
router.get("/", appController.dashboard);

router.route("/login").post(authController.login, authController.redirect);
router.route("/logout").post(authController.logout);

// router.route("/register").post(authController.register);
// router.route("/register").post(userController.register);

router.get("/profile", userController.getProfile);

// users crud starts here

// router
//   .route("/users")
//   .post(
//     createUser,
//     validateBody,
//     permissionMiddleware("employees-create"),
//     userController.createUser
//   )
//   .delete(
//     deleteUser,
//     validateBody,
//     permissionMiddleware("employees-delete"),
//     userController.deleteUser
//   )
//   .put(
//     updateUser,
//     validateBody,
//     permissionMiddleware("employees-update"),
//     userController.updateUser
//   )
//   .get(permissionMiddleware("employees-read"), userController.getAllUsers);
//list of users ends here

// Account Pages_______________________________________________________________________

// Render Pages_______________________________________________________________________

//______________________________________________________________________________________

//___________________________________API for Doctors______________________________
router
  .route("/doctor")
  .post(catchErrors(doctorController.create))
  .get(catchErrors(doctorController.getAll));
router
  .route("/doctor/:id")
  .get(catchErrors(doctorController.read))
  .put(catchErrors(doctorController.update))
  .delete(catchErrors(doctorController.delete));
router.route("/doctor/search").get(catchErrors(doctorController.search));
router
  .route("/doctor/find/:filter/:equal")
  .get(catchErrors(doctorController.getByFilter));

//_________________________________________________________________________________________;
// // Download pdf file
router.route("/public/download/:pdfname?").get(appController.download);

// //_________________________________________________________________API for patients_____________________
router
  .route("/patient")
  .post(catchErrors(patientController.create))
  .get(catchErrors(patientController.getAll));
router
  .route("/patient/:id")
  .put(catchErrors(patientController.update))
  .delete(catchErrors(patientController.delete));
router.route("/patient/search").get(catchErrors(patientController.search));
router
  .route("/patient/find/:filter/:equal")
  .get(catchErrors(patientController.getByFilter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for employees_____________________
router
  .route("/employee")
  .post(catchErrors(employeeController.create))
  .get(catchErrors(employeeController.getAll));
router
  .route("/employee/:id")
  .put(catchErrors(employeeController.update))
  .delete(catchErrors(employeeController.delete));
router.route("/employee/search").get(catchErrors(employeeController.search));
router
  .route("/employee/find/:filter/:equal")
  .get(catchErrors(employeeController.getByFilter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for departements_____________________
router
  .route("/department")
  .post(catchErrors(departmentController.create))
  .get(catchErrors(departmentController.getAll));
router
  .route("/department/:id")
  .put(catchErrors(departmentController.update))
  .delete(catchErrors(departmentController.delete));
router
  .route("/department/search")
  .get(catchErrors(departmentController.search));
router
  .route("/department/find/:filter/:equal")
  .get(catchErrors(departmentController.getByFilter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for speciality_____________________
router
  .route("/specialty")
  .post(catchErrors(specialtyController.create))
  .get(catchErrors(specialtyController.getAll));
router
  .route("/specialty/:id")
  .put(catchErrors(specialtyController.update))
  .delete(catchErrors(specialtyController.delete));
router.route("/specialty/search").get(catchErrors(specialtyController.search));
router
  .route("/specialty/find/:filter/:equal")
  .get(catchErrors(specialtyController.getByFilter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for position_____________________
router
  .route("/position")
  .post(catchErrors(positionController.create))
  .get(catchErrors(positionController.getAll));
router
  .route("/position/:id")
  .put(catchErrors(positionController.update))
  .delete(catchErrors(positionController.delete));
router.route("/position/search").get(catchErrors(positionController.search));
router
  .route("/position/find/:filter/:equal")
  .get(catchErrors(positionController.getByFilter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for appointement_________________
router
  .route("/appointment")
  .post(catchErrors(appointmentController.create))
  .get(catchErrors(appointmentController.getAll));
router
  .route("/appointment/:id")
  .put(catchErrors(appointmentController.update))
  .delete(catchErrors(appointmentController.delete));
router
  .route("/appointment/search")
  .get(catchErrors(appointmentController.search));
router
  .route("/appointment/find/:filter/:equal")
  .get(catchErrors(appointmentController.getByFilter));

router
  .route("/appointment/count/:status")
  .get(catchErrors(appointmentController.getAllAppointmentCount));
router
  .route("/appointment/doctor/:doctorid/:status")
  .get(catchErrors(appointmentController.getAppointmentCountByDoctorId));
router
  .route("/appointment/getby/:filter/:equal/:date")
  .get(catchErrors(appointmentController.getFilterbyDate));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for medicament____________________

router
  .route("/medicament")
  .post(catchErrors(medicamentController.create))
  .get(catchErrors(medicamentController.getAll));
router
  .route("/medicament/:id")
  .put(catchErrors(medicamentController.update))
  .delete(catchErrors(medicamentController.delete));
router
  .route("/medicament/search")
  .get(catchErrors(medicamentController.search));
router
  .route("/medicament/find/:filter/:equal")
  .get(catchErrors(medicamentController.getByFilter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for consultation__________________
var consultationAudioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/consultation");
  },
  filename: function (req, file, cb) {
    var ext = ".mp3";
    cb(null, Date.now() + ext); //Appending extension
  },
});
const consultationAudioUpload = multer({ storage: consultationAudioStorage });

router
  .route("/consultation-recording")
  .post(
    [consultationAudioUpload.single("audioFile"), setFilePathToBody],
    catchErrors(consultationRecordingController.create)
  );
router
  .route("/consultation-recording/:id")
  .delete(catchErrors(consultationRecordingController.delete))
  .get(catchErrors(consultationRecordingController.read));
router
  .route("/consultation-recording/find/:filter/:equal")
  .get(catchErrors(consultationRecordingController.getByFilter));

router
  .route("/consultation")
  .post(catchErrors(consultationController.create))
  .get(catchErrors(consultationController.getAll));
router
  .route("/consultation/:id")
  .put(catchErrors(consultationController.update))
  .delete(catchErrors(consultationController.delete));
router
  .route("/consultation/search")
  .get(catchErrors(consultationController.search));
router
  .route("/consultation/find/:filter/:equal")
  .get(catchErrors(consultationController.getByFilter));
router
  .route("/consultation/unpaid/count/:doctorid?")
  .get(catchErrors(consultationController.getUnpaidConsultationCount));
router
  .route("/consultation/unpaid/list/:patientid/:status")
  .get(catchErrors(consultationController.getUnpaidConsultationByPatientId));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for Laboratory consultation__________________

// router
//   .route("/laboratoryConsultation")
//   .post(catchErrors(laboratoryConsultation.create))
//   .get(catchErrors(laboratoryConsultation.getAll));
// router
//   .route("/laboratoryConsultation/:id")
//   .put(catchErrors(laboratoryConsultation.update))
//   .delete(catchErrors(laboratoryConsultation.delete));
// router
//   .route("/laboratoryConsultation/search")
//   .get(catchErrors(laboratoryConsultation.search));
// router
//   .route("/laboratoryConsultation/find/:filter/:equal")
//   .get(catchErrors(laboratoryConsultation.getByFilter));

// router.get(
//   "/api/laboratoryConsultation/unpaid/count/:doctorid?",
//   catchErrors(laboratoryConsultationController.getUnpaidConsultationCount)
// );
// router.get(
//   "/api/laboratory-consultation/unpaid/list/:patientid/:status",
//   catchErrors(laboratoryConsultationController.getUnpaidConsultationByPatientId)
// );

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for currency ____________________

router
  .route("/currency")
  .post(catchErrors(currencyController.create))
  .get(catchErrors(currencyController.getAll));
router
  .route("/currency/:id")
  .put(catchErrors(currencyController.update))
  .delete(catchErrors(currencyController.delete));
router.route("/currency/search").get(catchErrors(currencyController.search));
router
  .route("/currency/find/:filter/:equal")
  .get(catchErrors(currencyController.getByFilter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for preinscription_______________

router
  .route("/prescription")
  .post(catchErrors(prescriptionController.create))
  .get(catchErrors(prescriptionController.getAll));
router
  .route("/prescription/:id")
  .put(catchErrors(prescriptionController.update))
  .delete(catchErrors(prescriptionController.delete));
router
  .route("/prescription/search")
  .get(catchErrors(prescriptionController.search));
router
  .route("/prescription/find/:filter/:equal")
  .get(catchErrors(prescriptionController.getByFilter));

router
  .route("/prescription/pdf/:id")
  .get(catchErrors(prescriptionController.generatePDF));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for payment mode_____________________

router
  .route("/paymentMode")
  .post(catchErrors(paymentModeController.create))
  .get(catchErrors(paymentModeController.getAll));
router
  .route("/paymentMode/:id")
  .put(catchErrors(paymentModeController.update))
  .delete(catchErrors(paymentModeController.delete));
router
  .route("/paymentMode/search")
  .get(catchErrors(paymentModeController.search));
router
  .route("/paymentMode/find/:filter/:equal")
  .get(catchErrors(paymentModeController.getByFilter));

// //_________________________________________________________________API for payement_____________________

router
  .route("/payment")
  .post(catchErrors(paymentController.create))
  .get(catchErrors(paymentController.getAll));
router
  .route("/payment/:id")
  .put(catchErrors(paymentController.update))
  .delete(catchErrors(paymentController.delete));
router.route("/payment/search").get(catchErrors(paymentController.search));
router
  .route("/payment/find/:filter/:equal")
  .get(catchErrors(paymentController.getByFilter));

router
  .route("/payment/pdf/:id")
  .get(catchErrors(paymentController.generatePDF));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for analysis_____________________

router
  .route("/analysis")
  .post(catchErrors(analysisController.create))
  .get(catchErrors(analysisController.getAll));
router
  .route("/analysis/:id")
  .put(catchErrors(analysisController.update))
  .delete(catchErrors(analysisController.delete));
router.route("/analysis/search").get(catchErrors(analysisController.search));
router
  .route("/analysis/find/:filter/:equal")
  .get(catchErrors(analysisController.getByFilter));

router
  .route("/analysis/pdf/:id")
  .get(catchErrors(analysisController.generatePDF));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for analysis type_________________

router
  .route("/analysisType")
  .post(catchErrors(analysisTypeController.create))
  .get(catchErrors(analysisTypeController.getAll));
router
  .route("/analysisType/:id")
  .put(catchErrors(analysisTypeController.update))
  .delete(catchErrors(analysisTypeController.delete));
router
  .route("/analysisType/search")
  .get(catchErrors(analysisTypeController.search));
router
  .route("/analysisType/find/:filter/:equal")
  .get(catchErrors(analysisTypeController.getByFilter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for IRM SCANS_____________________
router
  .route("/mriScan")
  .post(catchErrors(mriScanController.create))
  .get(catchErrors(mriScanController.getAll));
router
  .route("/mriScan/:id")
  .put(catchErrors(mriScanController.update))
  .delete(catchErrors(mriScanController.delete));
router.route("/mriScan/search").get(catchErrors(mriScanController.search));
router
  .route("/mriScan/find/:filter/:equal")
  .get(catchErrors(mriScanController.getByFilter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for IRM Scan types________________

router
  .route("/mriScanType")
  .post(catchErrors(mriScanTypeController.create))
  .get(catchErrors(mriScanTypeController.getAll));
router
  .route("/mriScanType/:id")
  .put(catchErrors(mriScanTypeController.update))
  .delete(catchErrors(mriScanTypeController.delete));
router
  .route("/mriScanType/search")
  .get(catchErrors(mriScanTypeController.search));
router
  .route("/mriScanType/find/:filter/:equal")
  .get(catchErrors(mriScanTypeController.getByFilter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for clients_______________________
router
  .route("/client")
  .post(catchErrors(clientController.create))
  .get(catchErrors(clientController.getAll));
router
  .route("/client/:id")
  .put(catchErrors(clientController.update))
  .delete(catchErrors(clientController.delete));
router.route("/client/search").get(catchErrors(clientController.search));
router
  .route("/client/find/:filter/:equal")
  .get(catchErrors(clientController.getByFilter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for invoices_____________________

// router
//   .route("/invoice")
//   .post(catchErrors(invoiceController.create))
//   .get(catchErrors(invoiceController.getAll));
// router
//   .route("/invoice/:id")
//   .put(catchErrors(invoiceController.update))
//   .delete(catchErrors(invoiceController.delete));
// router.route("/invoice/search").get(catchErrors(invoiceController.search));
// router
//   .route("/invoice/find/:filter/:equal")
//   .get(catchErrors(invoiceController.getByFilter));

// router
//   .route("/invoice/pdf/:id")
//   .get(catchErrors(invoiceController.generatePDF));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for items_____________________
router
  .route("/item")
  .post(catchErrors(itemController.create))
  .get(catchErrors(itemController.getAll));
router
  .route("/item/:id")
  .put(catchErrors(itemController.update))
  .delete(catchErrors(itemController.delete));
router.route("/item/search").get(catchErrors(itemController.search));
router
  .route("/item/find/:filter/:equal")
  .get(catchErrors(itemController.getByFilter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for Quotes_____________________
router
  .route("/quote")
  .post(catchErrors(quoteController.create))
  .get(catchErrors(quoteController.getAll));
router
  .route("/quote/:id")
  .put(catchErrors(quoteController.update))
  .delete(catchErrors(quoteController.delete));
router.route("/quote/search").get(catchErrors(quoteController.search));
router
  .route("/quote/find/:filter/:equal")
  .get(catchErrors(quoteController.getByFilter));

router.route("/quote/pdf/:id").get(catchErrors(quoteController.generatePDF));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for suppliers_____________________
router
  .route("/supplier")
  .post(catchErrors(supplierController.create))
  .get(catchErrors(supplierController.getAll));
router
  .route("/supplier/:id")
  .put(catchErrors(supplierController.update))
  .delete(catchErrors(supplierController.delete));
router.route("/supplier/search").get(catchErrors(supplierController.search));
router
  .route("/supplier/find/:filter/:equal")
  .get(catchErrors(supplierController.getByFilter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for order Forms_____________________
router
  .route("/orderForm")
  .post(catchErrors(orderFormController.create))
  .get(catchErrors(orderFormController.getAll));
router
  .route("/orderForm/:id")
  .put(catchErrors(orderFormController.update))
  .delete(catchErrors(orderFormController.delete));
router.route("/orderForm/search").get(catchErrors(orderFormController.search));
router
  .route("/orderForm/find/:filter/:equal")
  .get(catchErrors(orderFormController.getByFilter));

router
  .route("/orderForm/pdf/:id")
  .get(catchErrors(orderFormController.generatePDF));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for expenses_____________________
router
  .route("/expense")
  .post(catchErrors(expenseController.create))
  .get(catchErrors(expenseController.getAll));
router
  .route("/expense/:id")
  .put(catchErrors(expenseController.update))
  .delete(catchErrors(expenseController.delete));
router.route("/expense/search").get(catchErrors(expenseController.search));
router
  .route("/expense/find/:filter/:equal")
  .get(catchErrors(expenseController.getByFilter));
// //______________________________________________________________________________________________________

// //_________________________________________________________________API for expense categories________________
router
  .route("/expenseCategory")
  .post(catchErrors(expenseCategoryController.create))
  .get(catchErrors(expenseCategoryController.getAll));
router
  .route("/expenseCategory/:id")
  .put(catchErrors(expenseCategoryController.update))
  .delete(catchErrors(expenseCategoryController.delete));
router
  .route("/expenseCategory/search")
  .get(catchErrors(expenseCategoryController.search));
router
  .route("/expenseCategory/find/:filter/:equal")
  .get(catchErrors(expenseCategoryController.getByFilter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for client payments_________________
router
  .route("/clientPayment")
  .post(catchErrors(clientPaymentController.create))
  .get(catchErrors(clientPaymentController.getAll));
router
  .route("/clientPayment/:id")
  .put(catchErrors(clientPaymentController.update))
  .delete(catchErrors(clientPaymentController.delete));
router
  .route("/clientPayment/search")
  .get(catchErrors(clientPaymentController.search));
router
  .route("/clientPayment/find/:filter/:equal")
  .get(catchErrors(clientPaymentController.getByFilter));

router
  .route("/clientPayment/pdf/:id")
  .get(catchErrors(clientPaymentController.generatePDF));

// //_________________________________________________________________API for consultation type_________________
router
  .route("/consultationType")
  .post(catchErrors(consultationTypeController.create))
  .get(catchErrors(consultationTypeController.getAll));
router
  .route("/consultationType/:id")
  .put(catchErrors(consultationTypeController.update))
  .delete(catchErrors(consultationTypeController.delete));
router
  .route("/consultationType/search")
  .get(catchErrors(consultationTypeController.search));
router
  .route("/consultationType/find/:filter/:equal")
  .get(catchErrors(consultationTypeController.getByFilter));

// //_________________________________________________________________API for Global Setting _________________
router
  .route("/settingGlobal")
  .post(catchErrors(settingGlobalController.create))
  .get(catchErrors(settingGlobalController.getAll));
router
  .route("/settingGlobal/:id")
  .put(catchErrors(settingGlobalController.update))
  .delete(catchErrors(settingGlobalController.delete));
router
  .route("/settingGlobal/search")
  .get(catchErrors(settingGlobalController.search));
router
  .route("/settingGlobal/find/:filter/:equal")
  .get(catchErrors(settingGlobalController.getByFilter));

// //_____________________________________________________________________________________________________________________________________________________________________________

// //_________________________________________________________________API for Medical Setting _________________
router
  .route("/settingMedical")
  .post(catchErrors(settingMedicalController.create))
  .get(catchErrors(settingMedicalController.getAll));
router
  .route("/settingMedical/:id")
  .put(catchErrors(settingMedicalController.update))
  .delete(catchErrors(settingMedicalController.delete));
router
  .route("/settingMedical/search")
  .get(catchErrors(settingMedicalController.search));
router
  .route("/settingMedical/find/:filter/:equal")
  .get(catchErrors(settingMedicalController.getByFilter));

// //_____________________________________________________________________________________________________________________________________________________________________________

// //_________________________________________________________________API for Commercial Setting _________________
router
  .route("/settingCommercial")
  .post(catchErrors(settingCommercialController.create))
  .get(catchErrors(settingCommercialController.getAll));
router
  .route("/settingCommercial/:id")
  .put(catchErrors(settingCommercialController.update))
  .delete(catchErrors(settingCommercialController.delete));
router
  .route("/settingCommercial/search")
  .get(catchErrors(settingCommercialController.search));
router
  .route("/settingCommercial/find/:filter/:equal")
  .get(catchErrors(settingCommercialController.getByFilter));

// //_____________________________________________________________________________________________________________________________________________________________________________

// //_________________________________________________________________API for Task Setting _________________
router
  .route("/task")
  .post(catchErrors(taskController.create))
  .get(catchErrors(taskController.getAll));
router
  .route("/task/:id")
  .put(catchErrors(taskController.update))
  .delete(catchErrors(taskController.delete));
router.route("/task/search").get(catchErrors(taskController.search));
router
  .route("/task/find/:filter/:equal")
  .get(catchErrors(taskController.getByFilter));

// //_________________________________________________________________API for Custom Menu _________________
router
  .route("/customMenu")
  .post(catchErrors(customMenuController.create))
  .get(catchErrors(customMenuController.getAll));
router
  .route("/customMenu/:id")
  .put(catchErrors(customMenuController.update))
  .delete(catchErrors(customMenuController.delete));
router
  .route("/customMenu/search")
  .get(catchErrors(customMenuController.search));
router
  .route("/customMenu/find/:filter/:equal")
  .get(catchErrors(customMenuController.getByFilter));

// //_____________________________________________________________________________________________________________________________________________________________________________

// //_________________________________________________________________ account management_______________________________

// router.post("/login", authController.login, function (req, res) {
//   let user = JSON.parse(JSON.stringify(req.user));

//   if (req.body.remember) {
//     req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
//   } else {
//     req.session.cookie.expires = false; // Cookie expires at end of session
//   }

//   switch (user.dashbaordType) {
//     case "admin":
//       return res.redirect("/admindashboard");
//     // break;
//     case "doctor":
//       return res.redirect("/dootordashboard");
//     // break;
//     case "secritary":
//       return res.redirect("/secritarydashboard");
//     // sbreak;
//     default:
//       return res.redirect("/profile");
//   }
// });

// var userPhotoStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads/user");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const userPhotoUpload = multer({ storage: userPhotoStorage });
// router.post(
//   "/account",
//   [userPhotoUpload.single("photo"), setFilePathToBody],
//   catchErrors(userController.updateAccount)
// );
// router.post("/account/forgot", catchErrors(authController.forgot));
// router.get("/account/reset/:token", catchErrors(authController.reset));
// router.post(
//   "/account/reset/:token",
//   authController.confirmedPasswords,
//   catchErrors(authController.update)
// );
// //____________________________________________________________________________________________________________________

// //_________________________________________________________________ uploads_______________________________
// router.get("/upload", uploadController.uploadsView);
// router.post("/upload", upload.single("imageupload"), function (req, res) {
//   res.send("File upload sucessfully.");
// });

// //_________________________________________________________________ role management_______________________________
router.get(
  "/roles",
  permissionMiddleware("admin-create"),
  roleController.getUserWithRoles
);
router.post(
  "/roles",
  permissionMiddleware("admin-create"),
  roleController.setUpUserWithRole
);

// //_________________________________________________________________ permissions management_______________________________
// // this route is used to get get the list of the users that we can give permissions to
// router.get(
//   "/permissions/users",
//   permissionMiddleware("employees-read"),
//   permissionController.getUsers
// );
// // this route is used to get a list of the permissions of the chosed used ( user _id passed as a param in the link)
// router.get(
//   "/permissions/users/:_id",
//   permissionMiddleware("employees-read"),
//   permissionController.getUserPermissions
// );
// // this route is used to update the permissions of the selected user ( the user is pre selected throw the previous)
// router.post(
//   "/permissions/users/update",
//   permissionMiddleware("employees-update"),
//   permissionController.updateUserPermissions
// );
// //router.post('/roles',permissionMiddleware('admin-create'), roleController.setUpUserWithRole);

// // Hello salah, this is just a test !
// //  we can delete this later
// const mail = require("../handlers/mail");
// router.get("/emailTest", (req, res) => {
//   console.log("we in ");
//   mail.send({
//     filename: "email-layout",
//     email: "abdoumjr@gmail.com",
//     subject: "This is just a test :)",
//   });
//   res.send("Mail sent!");
// });
// // Test ends here :)

// // this is a test for queued email
// // this test will send an email in 1 minute :) just for test reasons
// const mailJob = require("../jobs/mailJob");
// router.get("/mailJobTest", (req, res) => {
//   let when = new Date();
//   // this is just for testing
//   when.setMinutes(when.getMinutes() + 1);
//   when.setHours(when.getHours() + 1);

//   // we can pass the date and time when we want our email to be sent here as "when"
//   mailJob(when);
//   res.send("Sending emails");
// });

// router.get("*", appController.notFound);

module.exports = router;
