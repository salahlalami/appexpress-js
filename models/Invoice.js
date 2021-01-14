const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const invoiceSchema = new mongoose.Schema({
  removed: {
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
  recurring: {
    type: Boolean,
  },
  date: {
    type: String,
    required: true,
  },
  dateExpired: {
    type: String,
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
    type: String,
    required: true,
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
  credit: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  clientPayment: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "ClientPayment",
    },
  ],
  paymentStatus: {
    type: String,
    trim: true,
    default: "0",
  },
  note: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 1,
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

module.exports = mongoose.model("Invoice", invoiceSchema);
