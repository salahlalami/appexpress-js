const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const medicamentSchema = new mongoose.Schema({
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
  description: {
    type: String,
  },
  status: {
    type: String,
    default: 1,
    required: true,
  },
});

module.exports = mongoose.model("Medicament", medicamentSchema);
