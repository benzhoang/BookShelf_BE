const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  categoryName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  available: { type: Boolean, default: true }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model("Category", CategorySchema)