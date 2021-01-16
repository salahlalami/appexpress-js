const mongoose = require("mongoose");
const User = mongoose.model("User");
// const promisify = require("es6-promisify");
// const UserController = require("./userController");
require("dotenv").config({ path: ".variables.env" });
var objectLodash = require("lodash/fp/object");

exports.getAll = async (req, res) => {
  const page = req.params.page || 1;
  const limit = parseInt(req.params.items) || 10;
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
    const countPromise = User.count();
    // Resolving both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };

    res.status(200).json({
      success: true,
      result,
      pagination,
      message: "Successfully found all documents",
    });
  } catch {
    res
      .status(500)
      .json({ success: false, result: [], message: "Oops there is an Error" });
  }
};

exports.profile = async (req, res) => {
  try {
    //  Query the database for a list of all results

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

    res.status(200).json({
      success: true,
      result,
      message: "Successfully found all documents",
    });
  } catch {
    res
      .status(500)
      .json({ success: false, result: [], message: "Oops there is an Error" });
  }
};

const userFromRequest = (request) => {
  // if (UserController.isValidUser(request)) {
  //   return new User(request.body);
  // }
  return null;
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody("name");
  req.checkBody("name", "You must supply a name!").notEmpty();
  req.checkBody("email", "That Email is not valid!").isEmail();
  req.sanitizeBody("email").normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody("password", "Password Cannot be Blank!").notEmpty();
  req
    .checkBody("password-confirm", "Confirmed Password cannot be blank!")
    .notEmpty();
  req
    .checkBody("password-confirm", "Oops! Your passwords do not match")
    .equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash(
      "error",
      errors.map((err) => err.msg)
    );
    res.render("register", {
      title: "Register",
      body: req.body,
      flashes: req.flash(),
    });
    return; // stop the fn from running
  }
  next(); // there were no errors!
};

exports.register = async (request, response, next) => {
  if (UserController.isValidUser(request)) {
    // insert only if we have required data
    // we can find by username or email
    // because they are unique
    // insert only if user not exist
    const email = request.body.email || "";
    User.findOne({ email: email }, (error, user) => {
      // insert only if user not exist
      if (error) {
        response.status(401).send({
          success: false,
          message: error.message,
        });
      } else {
        if (!user) {
          const userModel = userFromRequest(request);

          userModel.save((error) => {
            if (error) {
              response.status(401).send({
                success: false,
                message: error.message,
              });
            } else {
              response.status(200).send({
                success: true,
                user: userModel,
              });
            }
          });
        } else {
          response.status(401).send({
            success: false,
            message: "User allready exists",
          });
        }
      }
    });
  } else {
    return response.status(401).send({
      success: false,
      message: "invalide body",
    });
  }

  /*  const exist = await User.findOne({ email: req.body.email });
  console.log(exist);
  if (exist == null) {
    const user = new User({ email: req.body.email, name: req.body.name });
    console.log(user);
    const register = promisify(User.register, User);
    console.log(register);
    await register(user, req.body.password);
    next(); // pass to authController.login
  } else {
    const error = "User Exist";
    console.log(error);
    req.flash("error", error);
    res.render("register", {
      title: "Register",
      body: req.body,
      flashes: req.flash(),
    });
  }*/
};

exports.getAllUsers = async (req, res) => {
  let tmp_data = await User.aggregate([
    {
      $match: {
        removed: false,
      },
    },
    {
      $project: {
        _id: 1,
        email: 1,
        name: 1,
      },
    },
  ]);

  return res.send(tmp_data);
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: "query" }
  );
  req.flash("success", "Updated the profile!");
  res.redirect("back");
};

exports.createUser = async (req, res, next) => {
  let tmp_data = new User({
    email: req.body.email,
    name: req.body.name,
    password: new Date().getTime().toString(36),
  });

  return res.send(await tmp_data.save());
};

exports.updateUser = async (req, res, next) => {
  let tmp_data = await User.findOne({ _id: req.body._id });

  tmp_data.email = req.body.email;
  tmp_data.name = req.body.name;

  return res.send(await tmp_data.save());
};

exports.deleteUser = async (req, res, next) => {
  let tmp_data = await User.findOne({ _id: req.body._id });

  tmp_data.removed = true;

  return res.send(await tmp_data.save());
};

exports.profile = async (req, res, next) => {
  // let tmp_data = await User.findOne({ _id : req.user._id }).select(['name','email','_id'])
  // Calculating total pages
  // let result = [];
  // tmpData.forEach((element) => {
  //   var obj = JSON.parse(JSON.stringify(element));

  //   result.push(
  //     objectLodash.pick(obj, [
  //       "
  //       "email",
  //       "name",
  //       "surname",
  //       "photo",
  //       "accountType",
  //       "dashboardType",
  //       "doctor",
  //       "employee",
  //     ])
  //   );
  // });
  let tmp_data = await User.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "permissions",
        localField: "permissions",
        foreignField: "_id",
        as: "permissions",
      },
    },
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "role",
      },
    },
    {
      $unwind: {
        path: "$role",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        password: 0,
      },
    },
  ]);

  return res.send(tmp_data);
};

exports.isValidUser = (request) => {
  if (request) {
    const email = request.body.email || "";
    const password = request.body.password || "";
    const name = request.body.name || "";
    if (email && password && name) {
      return true;
    }
  }
  return false;
};
