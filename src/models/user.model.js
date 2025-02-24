const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
<<<<<<< HEAD
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Manager", "Customer", "Staff"], default: "Customer" },
=======
    password: { type: String, required: false }, 
    role: { type: String, enum: ["Manager", "Customer", "Staff", "Admin"], default: "User" },
>>>>>>> 917f88ffe5ea0f24e66a0f3e34ea1418312f66ea
    accessToken: [{ type: String }],
    refreshToken: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
