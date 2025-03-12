const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const InvoiceDetailSchema = new Schema({
    invoiceID: {type: Schema.ObjectId, ref:"Invoice"},
    bookID: {type: Schema.ObjectId, ref: "Book"},
    quantity: {type: Number, required: true, default: 1},
    available: {type: Boolean, default: "true"}

}, {timestamps: true, versionKey: false});

module.exports = mongoose.model("InvoiceDetails", InvoiceDetailSchema);