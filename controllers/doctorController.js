const crudController = require("./helpersControllers/crudController");
let methods = crudController.createCRUDController("Doctor");

methods.generatePDF = require("./helpersControllers/custom").generatePDF(
  "Doctor",
  { filename: "Doctor-report", format: "A5" }
);

module.exports = methods;
