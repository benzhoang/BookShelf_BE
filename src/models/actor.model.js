const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ActorSchema = new Schema({
    actorName: { type: String, required: true },
    available: {type: Boolean, default: true}
}, { versionKey: false, timestamps: true })

module.exports = mongoose.model("Actor", ActorSchema);