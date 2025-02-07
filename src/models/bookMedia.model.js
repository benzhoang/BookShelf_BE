const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookMediaSchema = new Schema({
    origin: {type: String, required: true},
}, {versionKey: false})

module.exports= mongoose.model("BookMedia", BookMediaSchema)