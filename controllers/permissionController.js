const mongoose = require("mongoose");
const User = mongoose.model("User");
const Permission = mongoose.model("Permission");

// This function will return 2 lists => users list && roles list and then redirect to the roles page view
exports.getUsers = async (req, res, next) => {
  //un comment this after merging the roles branch
  //  let superAdminRole = await Role({name:'super_admin'})
  //   let tmpUsers = await User.find({role:{$ne:superAdminRole._id}}).populate('permissions')

  // get list of users
  let tmpUsers = await User.find({});

  // render the permissions users view
  // where we can see the list of the users that we can give permissions too :)
  res.render("permissions-users", {
    // the retunred collection contains one field "users"
    users: tmpUsers,
  });
};

exports.getUserPermissions = async (req, res, next) => {
  //un comment this after merging the roles branch
  //  let superAdminRole = await Role({name:'super_admin'})( )

  // get the current logged user informations,
  // so later in view we can compare our permissions with the selected user, to see what permissions we can give
  // because we can give only the permissions that we already have :)
  let me = await User.findOne({ _id: req.user._id }).populate("permissions");

  // get the selected user informations
  let user = await User.findOne({ _id: req.params._id }).populate(
    "permissions"
  );

  //  render the permissions page, this page will display a list of checkbox to check/unckeck to select wanted permissions
  // the select user permissions will display as checked by default :)
  res.render("permissions", {
    // the returned object contains  3 fields

    // 1 - the selected user informations
    user: user,
    // 2 - admin permissions ( ours )
    permissions: me.permissions,

    // 3 - the permissions of the selected user :)
    permissionsArrayIds: user.permissions.map((item) => item._id),
  });
};

// this will update the user permissions :)
exports.updateUserPermissions = async (req, res, next) => {
  // get selected user informations
  let user = await User.findOne({ _id: req.body.user });

  // push the permissions to the user
  user.permissions = req.body.permissions.split(",");

  // update the user informations
  await user.save();
  return res.send("Users permissions updated successfully");
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
      res.render("role", {
        users: tmpUsers,
        roles: tmpRoles,
        message: "The user already has that role!",
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
    res.render("role", {
      users: tmpUsers,
      roles: tmpRoles,
      message: "The user requested was not found!",
    });
  }
};
