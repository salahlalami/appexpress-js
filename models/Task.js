const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const taskSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Task", taskSchema);
