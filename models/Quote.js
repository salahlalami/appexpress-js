const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const quoteSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  converted: {
    type: Boolean,
    default: false,
  },
  number: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  dateExpired: {
    type: String,
    required: true,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
    required: true,
  },
  items: [
    {
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
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
  currency: {
    type: mongoose.Schema.ObjectId,
    ref: "Currency",
  },
  taxRate: {
    type: Number,
  },
  subTotal: {
    type: Number,
  },
  taxTotal: {
    type: Number,
  },
  total: {
    type: Number,
  },
  status: {
    type: String,
    trim: true,
    default: "0",
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  pdfPath: {
    type: String,
    default: "",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Quote", quoteSchema);
