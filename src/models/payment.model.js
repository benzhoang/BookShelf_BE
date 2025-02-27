const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    method: {
        type: String,
        required: true,
    },
    methodName: { type: String, required: true },
    available: { type: Boolean, default: true }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema)