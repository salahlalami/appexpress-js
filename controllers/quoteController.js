const mongoose = require("mongoose");
const Model = mongoose.model("Quote");
const custom = require("./helpersControllers/custom");

const crudController = require("./helpersControllers/crudController");
const methods = crudController.createCRUDController("Quote");

delete methods["create"];
delete methods["update"];

methods.create = async (req, res) => {
  try {
    var { items = [], taxRate = 0 } = req.body;

    // default
    var subTotal = 0;
    var taxTotal = 0;
    var total = 0;

    //Calculate the items array with subTotal, total, taxTotal
    items = items.map((item) => {
      let total = item["quantity"] * item["price"];
      //sub total
      subTotal += total;
      //item total
      item["total"] = total;
      return item;
    });

    taxTotal = subTotal * taxRate;
    total = subTotal + taxTotal;

    let body = req.body;

    body["subTotal"] = subTotal;
    body["taxTotal"] = taxTotal;
    body["total"] = total;

    // Creating a new document in the collection
    var result = await new Model(body).save();

    // Returning successfull response
    res.status(200).json({
      success: 1,
      data: result,
      message: "Successfully created the Quote in Model",
    });
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == "ValidationError") {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Required fields are not supplied",
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: 0,
        data: null,
        message: "Oops there is an Error",
      });
    }
  }
};

methods.update = async (req, res) => {
  try {
    const { id } = req.params;
    var { items = [], taxRate = 0 } = req.body;

    // default
    var subTotal = 0;
    var taxTotal = 0;
    var total = 0;

    //Calculate the items array with subTotal, total, taxTotal
    items = items.map((item) => {
      let total = item["quantity"] * item["price"];
      //sub total
      subTotal += total;
      //item total
      item["total"] = total;
      return item;
    });

    taxTotal = subTotal * taxRate;
    total = subTotal + taxTotal;

    let body = req.body;

    body["subTotal"] = subTotal;
    body["taxTotal"] = taxTotal;
    body["total"] = total;

    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate({ _id: id }, body, {
      new: true,
    }).exec();

    // Returning successfull response
    res.status(200).json({
      success: 1,
      data: result,
      message: "Successfully updated the Quote in Model",
    });
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == "ValidationError") {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Required fields are not supplied",
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: 0,
        data: null,
        message: "Oops there is an Error",
      });
    }
  }
};

module.exports = methods;
