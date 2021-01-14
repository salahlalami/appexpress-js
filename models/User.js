const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
// const md5 = require("md5");
// const validator = require("validator");
// const mongodbErrorHandler = require("mongoose-mongodb-errors");
// const passportLocalMongoose = require("passport-local-mongoose");
// const bcrypt = require("bcrypt");

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
    minlength: 7,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    trim: true,
    // validate: [validator.isEmail, "Invalid Email Address"],
    // required: "Please Supply an email address",
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
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  permissions: [{ type: mongoose.Schema.ObjectId, ref: "Permission" }],
  role: { type: mongoose.Schema.ObjectId, ref: "Role" },
  customMenu: [{ type: mongoose.Schema.ObjectId, ref: "CustomMenu" }],
});

// userSchema.virtual("gravatar").get(function () {
//   const hash = md5(this.email);
//   return `https://gravatar.com/avatar/${hash}?s=200`;
// });

// // pre saving user
// userSchema.pre("save", function (next) {
//   const user = this;

//   // only hash the password if it has been modified (or is new)
//   if (this.isModified("password") || this.isNew) {
//     bcrypt.genSalt(10, function (error, salt) {
//       // handle error
//       if (error) return next(error);

//       // hash the password using our new salt
//       bcrypt.hash(user.password, salt, function (error, hash) {
//         // handle error
//         if (error) return next(error);

//         // override the cleartext password with the hashed one
//         user.password = hash;
//         next();
//       });
//     });
//   } else {
//     return next();
//   }
// });

// // post saving user
// userSchema.post("save", function (user, next) {
//   next();
// });

// // compare password
// userSchema.methods.comparePassword = function (passw, cb) {
//   bcrypt.compare(passw, this.password, function (err, isMatch) {
//     if (err) {
//       return cb(err);
//     }
//     cb(null, isMatch);
//   });
// };

// userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
// userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("User", userSchema);
