const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ActorSchema = new Schema({
    actorName: {type: String, required: true}
})

module.exports= mongoose.model("Actor", ActorSchema);