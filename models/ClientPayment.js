const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const clientPaymentSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  number: {
    type: Number,
    required: true,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
    required: true,
  },
  year: {
    type: Date,
    default: Date.now,
  },
  invoice: {
    type: mongoose.Schema.ObjectId,
    ref: "Invoice",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: mongoose.Schema.ObjectId,
    ref: "Currency",
  },
  paymentMode: {
    type: mongoose.Schema.ObjectId,
    ref: "PaymentMode",
  },
  ref: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ClientPayment", clientPaymentSchema);
