const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
    bookName: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Schema.Types.Decimal128, required: true},
    imageURL: { type: String},
    actorID: {type: Schema.ObjectId, ref: "Actor"},
    categoryID: {type: Schema.ObjectId, ref: "Category"},
    bookMediaID: {type: Schema.Types.ObjectId, ref: "BookMedia"}
}, {versionKey: false})

module.exports = mongoose.model("Book", BookSchema);