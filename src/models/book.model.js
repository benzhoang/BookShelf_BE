const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
    bookName: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Schema.Types.Decimal128, required: true},
    actorID: {type: Schema.ObjectId, ref: "Actor"},
    categoryID: {type: Schema.ObjectId, ref: "Category"},
    bookMediaID: {type: Schema.Types.ObjectId, ref: "BookMedia"}
})

module.exports = mongoose.model("Book", BookSchema);