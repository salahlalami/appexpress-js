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
  name: { type: String, required: true },
  surname: { type: String, required: true },
  photo: {
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
    autopopulate: true,
  },
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: "Employee",
    autopopulate: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: { type: mongoose.Schema.ObjectId, ref: "Role", autopopulate: true },
  hasCustomPermissions: {
    type: Boolean,
    default: false,
  },
  permissions: [{ type: mongoose.Schema.ObjectId, ref: "Permission" }],
  customMenu: [{ type: mongoose.Schema.ObjectId, ref: "CustomMenu" }],
  isLoggedIn: { type: Boolean },
});

userSchema.plugin(require("mongoose-autopopulate"));

// generating a hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
