const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoleSchema = new Schema(
    {
        roleName: { type: String, required: true }
    },
    { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Role", RoleSchema);
