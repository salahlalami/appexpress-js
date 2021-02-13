const mongoose = require("mongoose");
const Model = mongoose.model("Prescription");
const Consultation = mongoose.model("Consultation");
const custom = require("./helpersControllers/custom");

const crudController = require("./helpersControllers/crudController");
const methods = crudController.createCRUDController("Prescription");

delete methods["create"];
delete methods["update"];

methods.create = async (req, res) => {
  try {
    // Creating a new document in the collection

    const result = await new Model(req.body).save();

    const fileId = "prescription-report-" + result._id + ".pdf";
    const updatePath = Model.findOneAndUpdate(
      { _id: result._id },
      { pdfPath: fileId },
      {
        new: true,
      }
    ).exec();
    // Returning successfull response

    const { _id: prescriptionId } = result;
    const consultationId = result.consultation._id;
    const consultationUpdate = Consultation.findByIdAndUpdate(
      { _id: consultationId },
      {
        $push: { prescription: prescriptionId },
      }
    ).exec();

    custom.generatePdf(
      "Prescription",
      { filename: "prescription-report", format: "A5" },
      result
    );

    const [updatedPath, consultationUpdated] = await Promise.all([
      updatePath,
      consultationUpdate,
    ]);
    res.status(200).json({
      success: true,
      result: updatedPath,
      message: "Successfully Created the document in Model ",
    });
  } catch (err) {
    console.log(err);
    // If err is thrown by Mongoose due to required validations
    if (err.name == "ValidationError") {
      res.status(400).json({
        success: false,
        result: null,
        message: "Required fields are not supplied",
      });
    } else {
      // Server Error
      res.status(500).json({
        success: false,
        result: null,
        message: "Oops there is an Error",
      });
    }
  }
};

methods.update = async (req, res) => {
  const { id } = req.params;
  try {
    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    }).exec();
    const fileId = "prescription-report-" + result._id + ".pdf";
    const updatedPath = await Model.findOneAndUpdate(
      { _id: result._id },
      { pdfPath: fileId },
      {
        new: true,
      }
    ).exec();
    // Returning successfull response

    await custom.generatePdf(
      "Prescription",
      { filename: "prescription-report", format: "A5" },
      result
    );

    res.status(200).json({
      success: true,
      result: updatedPath,
      message: "Successfully Created the document in Model ",
    });
  } catch (err) {
    console.log(err);
    // If err is thrown by Mongoose due to required validations
    if (err.name == "ValidationError") {
      res.status(400).json({
        success: false,
        result: null,
        message: "Required fields are not supplied",
      });
    } else {
      // Server Error
      res.status(500).json({
        success: false,
        result: null,
        message: "Oops there is an Error",
      });
    }
  }
};

methods.generatePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const Model = mongoose.model("Prescription");
    const prescription = await Model.findById(id);
    if (!prescription) {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: "Oops there is an Error sdsd",
      });
    }
    const getPug =
      prescription.type === "perscription" ? "Prescription" : "letter";
    await custom.generatePDF(
      "Prescription",
      { filename: "Prescription report", format: "A5" },
      getPug
    );
    //Returning successfull response
    res.status(200).json({
      success: true,
      data: [],
      message: "Successfully pdf generated",
    });
  } catch (error) {
    // Server Error
    res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};

module.exports = methods;
