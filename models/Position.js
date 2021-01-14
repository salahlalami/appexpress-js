const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const positionSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  // min salary & max salary
});

module.exports = mongoose.model("Position", positionSchema);
