const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
    codeBook: {type: String},
    bookName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Schema.Types.Decimal128, required: true },
    image: { type: String, required: true },
    quantity: {type: Number, required: true},
    actorID: { type: Schema.ObjectId, ref: "Actor" },
    categoryID: { type: Schema.ObjectId, ref: "Category" },
    bookMediaID: { type: Schema.Types.ObjectId, ref: "BookMedia" },
    available: { type: Boolean, default: true }
}, { versionKey: false, timestamps: true })

module.exports = mongoose.model("Book", BookSchema);