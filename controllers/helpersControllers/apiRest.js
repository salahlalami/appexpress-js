/**
 *  Retrieves a single document by id.
 *  @param {string} req.params.id
 *  @returns {Document} Single Document
 */

const moment = require("moment");

exports.read = async (Model, req, res) => {
  try {
    // Find document by id
    const result = await Model.findOne({ _id: req.params.id });
    // If no results found, return document not found
    if (!result) {
      res.status(404).json({
        success: 0,
        data: null,
        message: "No document found by this id: " + req.params.id,
      });
    } else {
      // Return success resposne
      res.status(200).json({
        success: 1,
        data: result,
        message: "we found this document by this id: " + req.params.id,
      });
    }
  } catch {
    // Server Error
    res.status(500).json({
      success: 0,
      data: null,
      message: "Oops there is an Error",
    });
  }
};

/**
 *  Creates a Single document by giving all necessary req.body fields
 *  @param {object} req.body
 *  @returns {string} Message
 */

exports.create = async (Model, req, res) => {
  try {
    // Creating a new document in the collection
    const result = await new Model(req.body).save();

    // Returning successfull response
    res.status(200).json({
      success: 1,
      data: result,
      message: "Successfully Created the document in Model ",
    });
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

/**
 *  Updates a Single document
 *  @param {object, string} (req.body, req.params.id)
 *  @returns {Document} Returns updated document
 */

exports.update = async (Model, req, res) => {
  try {
    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true, // return the new result instead of the old one
        runValidators: true,
      }
    ).exec();

    res.status(200).json({
      success: 1,
      data: result,
      message: "we update this document by this id: " + req.params.id,
    });
  } catch (err) {
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

/**
 *  Delete a Single document
 *  @param {string} req.params.id
 *  @returns {string} Message response
 */

exports.delete = async (Model, req, res) => {
  try {
    // Find the document by id and delete it
    const result = await Model.findOneAndDelete({ _id: req.params.id }).exec();
    // If no results found, return document not found
    if (!result) {
      res.status(404).json({
        success: 0,
        data: null,
        message: "No document found by this id: " + req.params.id,
      });
    } else {
      res.status(200).json({
        success: 1,
        data: result,
        message: "Successfully Deleted the document by id: " + req.params.id,
      });
    }
  } catch {
    res.status(500).json({
      success: 0,
      data: null,
      message: "Oops there is an Error",
    });
  }
};

/**
 *  Get all documents of a Model
 *  @param {Object} req.params
 *  @returns {Object} Results with pagination
 */

exports.getAll = async (Model, req, res) => {
  const page = req.params.page || 1;
  const limit = parseInt(req.params.items) || 10;
  const skip = page * limit - limit;
  try {
    //  Query the database for a list of all results
    const resultsPromise = Model.find()
      .skip(skip)
      .limit(limit)
      .sort({ created: "desc" })
      .populate();
    // Counting the total documents
    const countPromise = Model.count();
    // Resolving both promises
    const [data, count] = await Promise.all([resultsPromise, countPromise]);
    // Calculating total pages
    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };

    res.status(200).json({
      success: 1,
      data,
      pagination,
      message: "Successfully found all documents",
    });
  } catch {
    res
      .status(500)
      .json({ success: 0, data: [], message: "Oops there is an Error" });
  }
};

/**
 *  Searching documents with specific properties
 *  @param {Object} req.query
 *  @returns {Array} List of Documents
 */

exports.search = async (Model, req, res) => {
  // console.log(req.query.fields)
  const fieldsArray = req.query.fields
    ? req.query.fields.split(",")
    : ["name", "surname", "birthday"];

  const fields = { $or: [] };
  // for (const field of fieldsArray) {
  //   // console.log(field);
  //   const split = field.split(".");

  //   if(split.length>1) {
  //   const fieldParent = split[0];
  //   const fieldMatch = split[1];
  //   console.log(fieldParent);
  //   console.log(fieldMatch);
  //   fields.$or.push({ [fieldParent]: {
  //       $elemMatch: {

  //         [fieldMatch]: { $regex: new RegExp(req.query.q, "i") }
  //     }
  //   } });
  //   }
  //   else {
  //     fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, "i") } });
  //   }
  // }

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, "i") } });
  }
  // console.log(fields)
  try {
    let results = await Model.find(fields).sort({ name: "asc" }).limit(10);

    if (results.length >= 1) {
      res.status(200).json({
        success: 1,
        data: results,
        message: "Successfully found all documents",
      });
    } else {
      res
        .status(202)
        .json({
          success: 0,
          data: [],
          message: "No document found by this request",
        })
        .end();
    }
  } catch {
    res
      .status(500)
      .json({ success: 0, data: null, message: "Oops there is an Error" });
  }
};

/**
 *  Getting documents with filters
 *  @param {Object} req.params
 *  @returns {Array} List of Documents
 */

exports.getByFilter = async (Model, req, res) => {
  try {
    const filter = req.params.filter;
    const result = await Model.find().where(filter).equals(req.params.equal);
    res.status(200).json({
      success: 1,
      data: result,
      message:
        "Successfully found all documents where equal to : " + req.params.equal,
    });
  } catch {
    res
      .status(500)
      .json({ success: 0, data: null, message: "Oops there is an Error" });
  }
};

exports.getFilterbyDate = async (Model, req, res) => {
  try {
    const { filter, equal, date } = req.params;
    let day = null;
    if (date == "today") {
      day = moment().format("DD/MM/YYYY");
    } else if (date == "tomorrow") {
      day = moment().add(1, "days").format("DD/MM/YYYY");
    } else {
      day = moment(date, "DD-MM-YYYY").format("DD/MM/YYYY");
    }

    const result = await Model.find()
      .where(filter)
      .equals(equal)
      .where("date")
      .equals(day);

    if (result.length == 0) {
      res.status(400).json({
        success: 0,
        data: [],
        message: "Date not found for this api",
      });
    }

    res.status(200).json({
      success: 1,
      data: result,
      message: "Successfully found all documents where equal to : " + equal,
    });
  } catch (error) {
    res.status(500).json({
      success: 0,
      data: null,
      message: "Oops there is an Error",
    });
  }
};
