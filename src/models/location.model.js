const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  locationName: {
    type: String,
    required: true,
  },
  available: { type: Boolean, default: true }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model("Location", LocationSchema)