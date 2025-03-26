const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: function () { return !this.googleId; } },
    googleId: { type: String },
    wallet: { type: Schema.Types.Double, default: 0 },
    role: { type: String, enum: ["Admin", "Manager", "Customer", "Staff"], default: "Customer" },
    accessToken: [{ type: String }],
    refreshToken: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
