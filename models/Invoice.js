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
  },
  recurring: {
    type: String,
  },
  date: {
    type: String,
    required: true,
  },
  expiredDate: {
    type: String,
    required: true,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
    required: true,
    autopopulate: true,
  },
  items: [
    {
      itemName: {
        type: String,
        required: true,
      },
      description: {
        type: String,
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
  },
  status: {
    type: String,
    default: "Draft",
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

invoiceSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Invoice", invoiceSchema);
