const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookMediaSchema = new Schema({
    origin: { type: String, required: true },
    url: {type: String, required: true},
    available: {type: Boolean, default: true}
}, { versionKey: false, timestamps: true})

module.exports = mongoose.model("BookMedia", BookMediaSchema)