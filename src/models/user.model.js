const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false }, 
    role: { type: String, enum: ["Manager", "Customer", "Staff", "Admin"], default: "User" },
    accessToken: [{ type: String }],
    refreshToken: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
