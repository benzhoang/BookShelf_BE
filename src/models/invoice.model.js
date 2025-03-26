const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InvoiceSchema = new Schema(
  {
    userID: { type: mongoose.Types.ObjectId, ref: "User" },
    paymentID: { type: mongoose.Types.ObjectId, ref: "Payment" },
    totalPrice: { type: Number, required: true },
    payStatus: {type: String, required: true, enum: ["Pending", "Success", "Fail"], default: "Pending"},
    available: { type: Boolean, default: true },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("invoices", InvoiceSchema);
