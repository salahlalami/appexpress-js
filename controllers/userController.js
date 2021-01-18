const mongoose = require("mongoose");
const User = mongoose.model("User");

exports.list = async (req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;
  try {
    //  Query the database for a list of all results
    const resultsPromise = User.aggregate([
      {
        $match: {
          removed: false,
        },
      },
      {
        $project: {
          _id: 1,
          enabled: 1,
          email: 1,
          name: 1,
          surname: 1,
          photo: 1,
          accountType: 1,
          dashboardType: 1,
          doctor: 1,
          employee: 1,
        },
      },
    ])
      .skip(skip)
      .limit(limit)
      .sort({ created: "desc" });
    // Counting the total documents
    const countPromise = User.count({ removed: false });
    // Resolving both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: "Successfully found all documents",
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        pagination,
        message: "Collection is Empty",
      });
    }
  } catch {
    return res
      .status(500)
      .json({ success: false, result: [], message: "Oops there is an Error" });
  }
};

exports.profile = async (req, res) => {
  try {
    //  Query the database for a list of all results
    if (!req.user) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "couldn't found  user Profile ",
      });
    }
    let result = {
      _id: req.user._id,
      enabled: req.user.enabled,
      email: req.user.email,
      name: req.user.name,
      surname: req.user.surname,
      photo: req.user.photo,
      accountType: req.user.accountType,
      dashboardType: req.user.dashboardType,
      doctor: req.user.doctor,
      employee: req.user.employee,
    };

    return res.status(200).json({
      success: true,
      result,
      message: "Successfully found all documents",
    });
  } catch {
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};

exports.photo = async (req, res) => {
  try {
    // Find document by id
    const updates = {
      photo: req.body.photo,
    };

    const tmpResult = await User.findOneAndUpdate(
      { _id: req.user._id, removed: false },
      { $set: updates },
      { new: true, runValidators: true, context: "query" }
    );
    // If no results found, return document not found
    if (!tmpResult) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No document found by this id: " + req.params.id,
      });
    } else {
      // Return success resposne
      let result = {
        _id: tmpResult._id,
        enabled: tmpResult.enabled,
        email: tmpResult.email,
        name: tmpResult.name,
        surname: tmpResult.surname,
        photo: tmpResult.photo,
        accountType: tmpResult.accountType,
        dashboardType: tmpResult.dashboardType,
        doctor: tmpResult.doctor,
        employee: tmpResult.employee,
      };

      return res.status(200).json({
        success: true,
        result,
        message: "we found this document by this id: " + req.params.id,
      });
    }
  } catch {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};
exports.read = async (req, res) => {
  try {
    // Find document by id
    const tmpResult = await User.findOne({
      _id: req.params.id,
      removed: false,
    });
    // If no results found, return document not found
    if (!tmpResult) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No document found by this id: " + req.params.id,
      });
    } else {
      // Return success resposne
      let result = {
        _id: tmpResult._id,
        enabled: tmpResult.enabled,
        email: tmpResult.email,
        name: tmpResult.name,
        surname: tmpResult.surname,
        photo: tmpResult.photo,
        accountType: tmpResult.accountType,
        dashboardType: tmpResult.dashboardType,
        doctor: tmpResult.doctor,
        employee: tmpResult.employee,
      };

      return res.status(200).json({
        success: true,
        result,
        message: "we found this document by this id: " + req.params.id,
      });
    }
  } catch {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};

/**
 *  Creates a Single document by giving all necessary req.body fields
 *  @param {object} req.body
 *  @returns {string} Message
 */

exports.create = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const existingUser = await User.findOne({ email: email });

    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    if (password.length < 8)
      return res.status(400).json({
        msg: "The password needs to be at least 8 characters long.",
      });
    // if (password !== passwordCheck)
    //   return res
    //     .status(400)
    //     .json({ msg: "Enter the same password twice for verification." });
    var newUser = new User();
    const passwordHash = newUser.generateHash(password);
    req.body.password = passwordHash;

    const result = await new User(req.body).save();
    if (!result) {
      return res.status(403).json({
        success: false,
        result: null,
        message: "document couldn't save correctly",
      });
    }
    return res.status(200).send({
      success: true,
      result: {
        _id: result._id,
        enabled: result.enabled,
        email: result.email,
        name: result.name,
        surname: result.surname,
        photo: result.photo,
        accountType: result.accountType,
        dashboardType: result.dashboardType,
        doctor: result.doctor,
        employee: result.employee,
      },
    });
  } catch {
    return res.status(500).json({ success: false, message: "there is error" });
  }
};

/**
 *  Updates a Single document
 *  @param {object, string} (req.body, req.params.id)
 *  @returns {Document} Returns updated document
 */

exports.update = async (req, res) => {
  try {
    let { email } = req.body;

    if (email) {
      const existingUser = await User.findOne({ email: email });

      if (existingUser._id != req.params.id)
        return res
          .status(400)
          .json({ message: "An account with this email already exists." });
    }

    // Find document by id and updates with the required fields
    const result = await User.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      req.body,
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No document found by this id: " + req.params.id,
      });
    }
    return res.status(200).json({
      success: true,
      result: {
        _id: result._id,
        enabled: result.enabled,
        email: result.email,
        name: result.name,
        surname: result.surname,
        photo: result.photo,
        accountType: result.accountType,
        dashboardType: result.dashboardType,
        doctor: result.doctor,
        employee: result.employee,
      },
      message: "we update this document by this id: " + req.params.id,
    });
  } catch {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    let { password } = req.body;

    if (!password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    if (password.length < 8)
      return res.status(400).json({
        msg: "The password needs to be at least 8 characters long.",
      });

    // if (password !== passwordCheck)
    //   return res
    //     .status(400)
    //     .json({ msg: "Enter the same password twice for verification." });
    var newUser = new User();
    const passwordHash = newUser.generateHash(password);
    let updates = {
      password: passwordHash,
    };

    // Find document by id and updates with the required fields
    const result = await User.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No document found by this id: " + req.params.id,
      });
    }
    return res.status(200).json({
      success: true,
      result: {
        _id: result._id,
        enabled: result.enabled,
        email: result.email,
        name: result.name,
        surname: result.surname,
        photo: result.photo,
        accountType: result.accountType,
        dashboardType: result.dashboardType,
        doctor: result.doctor,
        employee: result.employee,
      },
      message: "we update the password by this id: " + req.params.id,
    });
  } catch {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    let updates = {
      removed: true,
    };
    // Find the document by id and delete it
    const result = await User.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();
    // If no results found, return document not found
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No document found by this id: " + req.params.id,
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: "Successfully Deleted the document by id: " + req.params.id,
      });
    }
  } catch {
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};

exports.status = async (req, res) => {
  try {
    if (req.query.enabled == "true" || req.query.enabled == "false") {
      let updates = {
        enabled: req.query.enabled,
      };
      // Find the document by id and delete it
      const result = await User.findOneAndUpdate(
        { _id: req.params.id, removed: false },
        { $set: updates },
        {
          new: true, // return the new result instead of the old one
        }
      ).exec();
      // If no results found, return document not found
      if (!result) {
        return res.status(404).json({
          success: false,
          result: null,
          message: "No document found by this id: " + req.params.id,
        });
      } else {
        return res.status(200).json({
          success: true,
          result,
          message:
            "Successfully update status of this document by id: " +
            req.params.id,
        });
      }
    } else {
      return res
        .status(202)
        .json({
          success: false,
          result: [],
          message: "couldn't change user status by this request",
        })
        .end();
    }
  } catch {
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};
exports.search = async (req, res) => {
  // console.log(req.query.fields)

  // console.log(fields)
  try {
    if (
      req.query.q === undefined ||
      req.query.q === "" ||
      req.query.q === " "
    ) {
      return res
        .status(202)
        .json({
          success: false,
          result: [],
          message: "No document found by this request",
        })
        .end();
    }

    const fieldsArray = req.query.fields
      ? req.query.fields.split(",")
      : ["name", "surname", "email"];

    const fields = { $or: [] };

    for (const field of fieldsArray) {
      fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, "i") } });
    }
    let result = await User.find(fields)
      .where("removed", false)
      .sort({ name: "asc" })
      .limit(10);

    if (result.length >= 1) {
      return res.status(200).json({
        success: true,
        result,
        message: "Successfully found all documents",
      });
    } else {
      return res.status(202).json({
        success: false,
        result: [],
        message: "No document found by this request",
      });
    }
  } catch {
    return res.status(500).json({
      success: false,
      result: [],
      message: "Oops there is an Error",
    });
  }
};

exports.filter = async (req, res) => {
  try {
    if (req.query.filter === undefined || req.query.equal === undefined) {
      return res.status(403).json({
        success: false,
        result: null,
        message: "filter not provided correctly",
      });
    }
    const result = await User.find({ removed: false })
      .where(req.query.filter)
      .equals(req.query.equal);
    return res.status(200).json({
      success: true,
      result,
      message:
        "Successfully found all documents where equal to : " + req.params.equal,
    });
  } catch {
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};
