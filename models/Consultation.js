const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const consultationSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: {
    type: String,
    trim: true,
    required: true,
  },
  consultationType: {
    type: mongoose.Schema.ObjectId,
    ref: "ConsultationType",
  },
  prescription: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Prescription",
    },
  ],
  total: {
    type: Number,
    default: 0,
    required: true,
  },
  payment: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Payment",
    },
  ],
  credit: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  paymentStatus: {
    type: String,
    trim: true,
    default: "0",
  },
  report: {
    type: String,
  },
  reportConverted: {
    type: Boolean,
    default: false,
  },
  audioFile: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "ConsultationRecording",
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
});

function autopopulate(next) {
  this.populate("patient");
  this.populate("doctor");
  this.populate("consultationType");
  next();
}

consultationSchema.pre("find", autopopulate);
consultationSchema.pre("findOne", autopopulate);
consultationSchema.pre("findOneAndUpdate", autopopulate);

module.exports = mongoose.model("Consultation", consultationSchema);
