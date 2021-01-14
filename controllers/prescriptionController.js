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

    // Returning successfull response
    res.status(200).json({
      success: 1,
      data: result,
      message: "Successfully Created the document in Model ",
    });

    const { _id: prescriptionId } = result;
    const consultationId = result.consultation._id;
    await Consultation.findByIdAndUpdate(
      { _id: consultationId },
      {
        $push: { prescription: prescriptionId },
      }
    ).exec();

    await custom.pdfGenerater(
      "Prescription",
      { filename: "prescription-report", format: "A5" },
      result
    );
    // await custom.pdfGenerater('Prescription', { filename: 'prescription-report', format:'A5' }, result, function (callback) {
    //   // if (callback.hasOwnProperty('success') && callback.success) {
    //   //     let { data } = callback;
    //   // }
    // });
  } catch (err) {
    console.log(err);
    // If err is thrown by Mongoose due to required validations
    if (err.name == "ValidationError") {
      res.status(400).json({
        success: 0,
        data: null,
        message: "Required fields are not supplied",
      });
    } else {
      // Server Error
      res.status(500).json({
        success: 0,
        data: null,
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
    // Returning successfull response
    res.status(200).json({
      success: 1,
      data: result,
      message: "Successfully Created the document in Model ",
    });

    await custom.pdfGenerater(
      "Prescription",
      { filename: "prescription-report", format: "A5" },
      result
    );
    // await  custom.pdfGenerater('Prescription', { filename: 'prescription-report', format:'A5' }, result, function (callback) {
    //   // if (callback.hasOwnProperty('success') && callback.success) {
    //   //     let { data } = callback;
    //   // }
    // });
  } catch (err) {
    console.log(err);
    // If err is thrown by Mongoose due to required validations
    if (err.name == "ValidationError") {
      res.status(400).json({
        success: 0,
        data: null,
        message: "Required fields are not supplied",
      });
    } else {
      // Server Error
      res.status(500).json({
        success: 0,
        data: null,
        message: "Oops there is an Error",
      });
    }
  }

  // try {
  //     // Find document by id and updates with the required fields
  //     const result = await Model.findOneAndUpdate({ _id: id }, req.body, {
  //         new: true,
  //     })
  //     .populate('doctor')
  //     .populate('medicamentsList')
  //     .exec();

  //     await custom.pdfGenerater('Prescription', { filename: 'prescription-report', format:"A4" }, result, function (callback) {
  //         if (callback.hasOwnProperty('success') && callback.success) {
  //             let { data } = callback;

  //             // Returning successfull response
  //             res.status(200).json({
  //                 success: 1,
  //                 data: data,
  //                 message: "Successfully updated the prescription in Model"
  //             });
  //         } else {

  //             // Server Error
  //             return res.status(500).json({
  //                 success: 0,
  //                 data: null,
  //                 message: "Oops there is an Error"
  //             });
  //         }
  //     });

  // } catch (err) {

  //     // If err is thrown by Mongoose due to required validations
  //     if (err.name == "ValidationError") {
  //         return res.status(400).json({
  //             success: 0,
  //             data: null,
  //             message: "Required fields are not supplied"
  //         });
  //     } else {
  //         // Server Error
  //         return res.status(500).json({
  //             success: 0,
  //             data: null,
  //             message: "Oops there is an Error"
  //         });
  //     }
  // }
};

methods.generatePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const Model = mongoose.model("Prescription");
    const prescription = await Model.findById(id);
    if (!prescription) {
      // Server Error
      return res.status(500).json({
        success: 0,
        data: null,
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
      success: 1,
      data: [],
      message: "Successfully pdf generated",
    });
  } catch (error) {
    // Server Error
    res.status(500).json({
      success: 0,
      data: null,
      message: "Oops there is an Error",
    });
  }
};

module.exports = methods;
