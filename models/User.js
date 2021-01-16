const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },
  surname: {
    type: String,
    trim: true,
  },
  photo: {
    type: String,
    trim: true,
  },
  dashboardType: {
    type: String,
    trim: true,
  },
  accountType: {
    type: String,
    trim: true,
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctor",
  },
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: "Employee",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  permissions: [{ type: mongoose.Schema.ObjectId, ref: "Permission" }],
  role: { type: mongoose.Schema.ObjectId, ref: "Role" },
  customMenu: [{ type: mongoose.Schema.ObjectId, ref: "CustomMenu" }],
});

// generating a hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
