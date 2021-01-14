const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const itemSchema = new mongoose.Schema({
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
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: mongoose.Schema.ObjectId,
    ref: "Currency",
  },
});

module.exports = mongoose.model("Item", itemSchema);
