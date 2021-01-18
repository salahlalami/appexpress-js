const mongoose = require("mongoose");
const getData = require("./helpersControllers/custom").getData;
const getOne = require("./helpersControllers/custom").getOne;

exports.login = (req, res) => {
  res.render("login", { title: "Login" });
};

exports.account = (req, res) => {
  res.render("account", { title: "Edit Your Account" });
};
exports.dashboard = (req, res) => {
  res.render("index", {
    title: "Cedimed app",
  });
};
exports.dashboardDoctor = (req, res) => {
  res.render("dashboardDoctor", {
    title: "Cedimed app",
  });
};
exports.dashboardSecretariat = (req, res) => {
  res.render("dashboardSecretariat", {
    title: "Tableau de bord Secrétariat",
  });
};
exports.download = (req, res) => {
  const file = `./public/download/${req.params.pdfname}`;
  res.download(file);
};
exports.patient = (req, res) => {
  console.log("you are on patients page");

  res.render("patient", {
    title: "Patients List",
  });
};

exports.employee = async (req, res) => {
  const [department, position, specialty] = await Promise.all([
    getData("Department"),
    getData("Position"),
    getData("Specialty"),
  ]);
  res.render("employee", {
    department,
    position,
    specialty,
    title: "employees List",
  });
};

exports.doctor = async (req, res) => {
  const [department, specialty] = await Promise.all([
    getData("Department"),
    getData("Specialty"),
  ]);
  res.render("doctor", { department, specialty, title: "doctor List" });
};

exports.department = (req, res) => {
  console.log("you are on departments page");

  res.render("department", {
    title: "Departments List",
  });
};

exports.specialty = (req, res) => {
  console.log("you are on specialty page");

  res.render("specialty", {
    title: "specialty List",
  });
};
exports.position = (req, res) => {
  console.log("you are on position page");

  res.render("position", {
    title: "Position List",
  });
};

exports.appointment = async (req, res) => {
  console.log("you are on appointment page");
  const [doctor, specialty] = await Promise.all([
    getData("Doctor"),
    getData("Specialty"),
  ]);
  res.render("appointment", { doctor, specialty, title: "appointment List" });
};

exports.medicament = (req, res) => {
  console.log("you are on medicaments page");

  res.render("medicament", {
    title: "Medicaments List",
  });
}; // YCF
/*<<<<<<< HEAD
 */ exports.laboratory = async (req, res) => {
  console.log("you are on analysis page");
  const [doctor, specialty] = await Promise.all([
    getData("Doctor"),
    getData("Specialty"),
  ]);
  res.render("laboratory", {
    doctor,
    specialty,
    title: "laboratory Consultation List",
  });
};

exports.analysisType = (req, res) => {
  console.log("you are on analyse type page");

  res.render("analysisType", {
    title: "Analysis Type",
  });
};

exports.client = (req, res) => {
  console.log("you are on client page");

  res.render("client", {
    title: "client",
  });
};

exports.clientPayment = (req, res) => {
  console.log("you are on client payement page");

  res.render("clientPayment", {
    title: "client Payement",
  });
};
exports.consultationType = async (req, res) => {
  console.log("you are on consultation Type page");
  const [specialtys] = await Promise.all([
    // getData("Doctor"),
    getData("Specialty"),
  ]);
  res.render("consultationType", { specialtys, title: "consultation Type" });
};

exports.currency = (req, res) => {
  console.log("you are on currency Type page");
  res.render("currencyType", {
    title: "currency Type",
  });
};

exports.expense = (req, res) => {
  console.log("you are on expense Type page");
  res.render("expense", {
    title: "expense",
  });
};

exports.expenseCategory = (req, res) => {
  console.log("you are on expense Category Type page");
  res.render("expenseCategory", {
    title: "Expense Category",
  });
};

exports.invoice = (req, res) => {
  console.log("you are on invoice page");
  res.render("invoice", {
    title: "invoice",
  });
};

exports.item = async (req, res) => {
  const [currencies] = await Promise.all([getData("Currency")]);

  console.log("you are on item page");
  res.render("item", {
    currencies,
    title: "item",
  });
};

exports.mriScan = (req, res) => {
  console.log("you are on mriScan page");
  res.render("mriScan", {
    title: "mriScan",
  });
};

exports.mriScanType = (req, res) => {
  console.log("you are on mriScanType page");
  res.render("mriScanType", {
    title: "MRI Scan Type",
  });
};

exports.orderForm = (req, res) => {
  console.log("you are on order Form page");
  res.render("orderForm", {
    title: "order Form",
  });
};

exports.payment = async (req, res) => {
  const [
    paymentModes,
    doctors,
    employees,
    patients,
    currencies,
  ] = await Promise.all([
    getData("PaymentMode"),
    getData("Doctor"),
    getData("Employee"),
    getData("Patient"),
    getData("Currency"),
  ]);
  console.log("you are on order Form page");
  res.render("payment", {
    paymentModes,
    doctors,
    employees,
    patients,
    currencies,
    title: "payment",
  });
};

exports.paymentMode = (req, res) => {
  console.log("you are on payment Mode page");
  res.render("paymentMode", {
    title: "payment Mode",
  });
};

exports.prescription = (req, res) => {
  console.log("you are on prescription page");
  res.render("prescription", {
    title: "prescription",
  });
};

exports.quote = async (req, res) => {
  const [currencies, employees] = await Promise.all([
    getData("Currency"),
    getData("Employee"),
  ]);
  res.render("quote", {
    title: "quote",
    currencies,
    employees,
  });
};

exports.supplier = (req, res) => {
  console.log("you are on supplier page");
  res.render("supplier", {
    title: "supplier",
  });
};

exports.settingGlobal = (req, res) => {
  console.log("you are on settingGlobal page");
  res.render("settingGlobal", {
    title: "Global setting",
  });
};

exports.settingMedical = (req, res) => {
  console.log("you are on settingMedical page");
  res.render("settingMedical", {
    title: "Medical setting",
  });
};

exports.settingCommercial = (req, res) => {
  console.log("you are on settingCommercial page");
  res.render("settingCommercial", {
    title: "Commercial setting",
  });
};

exports.recordAudio = (req, res) => {
  console.log("you are on recordAudio page");
  res.render("recordAudio", {
    title: "Record Audio",
  });
};
exports.customMenu = (req, res) => {
  console.log("you are on customMenu page");
  res.render("customMenu", {
    title: "Custom Menu",
  });
};

exports.task = (req, res) => {
  console.log("you are on task page");
  res.render("task", {
    title: "Task",
  });
};
/*=======
 */
exports.consultation = async (req, res) => {
  const Model = mongoose.model("ConsultationType");
  console.log("you are on consultation page");
  const doctorParam = req.params.doctorParam || null;
  let doctor = 0;
  let idSpecialty = null;
  let consultationTypes = [];
  console.log(req.params.doctorParam);

  if (doctorParam != null) {
    try {
      doctor = await getOne("Doctor", doctorParam);

      if (doctor != null) {
        idSpecialty = doctor.specialty._id;
        consultationTypes = await Model.find()
          .where("specialty")
          .equals(idSpecialty);
        // doctors.push(doctor);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    // [doctors, consultationTypes] = await Promise.all([
    //   getData("Doctor"),
    //   getData("ConsultationType"),
    // ]);
  }
  console.log(doctor);
  console.log(consultationTypes);
  res.render("consultation", {
    consultationTypes,
    doctor,
    title: "consultation",
  });
};

exports.notFound = (req, res) => {
  res.status(404);
  res.render("errors/404", {
    title: "Not Found",
  });
};
