const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    roleName: {type: String}
}, {versionKey: false})

module.exports = mongoose.model("Role", RoleSchema)