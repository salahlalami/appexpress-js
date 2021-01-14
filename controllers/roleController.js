const mongoose = require("mongoose");
const User = mongoose.model("User");
const Role = mongoose.model("Role");

// This function will return 2 lists => users list && roles list and then redirect to the roles page view
exports.getUserWithRoles = async (req, res, next) => {
  let tmpUser = await User.find({}).populate("role");
  let tmpRole = await Role.find({});
  res.status(200).json({
    users: tmpUser,
    roles: tmpRole,
  });
};

// This function will recieve 2 params in the body => role && user, you will find the rest inside the function
exports.setUpUserWithRole = async (req, res, next) => {
  let user = await User.findOne({ _id: req.body.user }).populate("role");
  let role = await Role.findOne({ _id: req.body.role });
  let tmpUsers = await User.find({}).populate("role");
  let tmpRoles = await Role.find({});

  if (user) {
    if (user.role && user.role._id.toString() == req.body.role.toString()) {
      /*  console.warn(user.role._id  +' ------- '+ req.body.role)
            console.warn(user.role._id.toString() == req.body.role.toString())
            console.warn(typeof mongoose.Types.ObjectId(user.role._id))
            console.warn(typeof mongoose.Types.ObjectId(req.role)) */
      res.status(200).json({
        users: tmpUser,
        roles: tmpRole,
      });
    } else {
      console.warn(role);
      user.role = role._id;
      user.permissions = role.permissions;
      await user.save();
      let newUsers = await User.find({}).populate("role");
      let newRoles = await Role.find({});
      res.render("role", {
        users: newUsers,
        roles: newRoles,
        message: "Users role updated successfully",
      });
    }
  } else {
    res.status(200).json({
      users: tmpUser,
      roles: tmpRole,
    });
  }
};
