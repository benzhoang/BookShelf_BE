const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true},
  roleID: { type: Schema.ObjectId, ref: "Role" },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("User", UserSchema);
