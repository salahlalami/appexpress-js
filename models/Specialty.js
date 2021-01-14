const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const specialtySchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 1,
    required: true,
  },
});

module.exports = mongoose.model("Specialty", specialtySchema);
