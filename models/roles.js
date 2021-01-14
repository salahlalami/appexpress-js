const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const roleSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  permissions: [{ type: mongoose.Schema.ObjectId, ref: "Permission" }],
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Role", roleSchema);
