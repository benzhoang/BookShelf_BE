const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
  userID: { type: mongoose.Types.ObjectId, ref: 'users' },
  paymentID: { type: mongoose.Types.ObjectId, ref: 'payments' },
  totalPrice: { type: Number, required: true },
  available: { type: Boolean, default: true }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model("Invoice", InvoiceSchema)