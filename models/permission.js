const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const permissionSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  displayName: {
    type: String,
    trim: true,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Permission", permissionSchema);
