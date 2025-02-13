const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user.model");

// Middleware to verify JWT token and attach user to req
exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied. No Token Provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // Attach user to request
    if (!req.user) return res.status(404).json({ success: false, message: "User not found." });

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

// Middleware to check Admin role
exports.isAdmin = (req, res, next) => {
  if (req.user.roleID !== "Admin") {
    return res.status(403).json({ success: false, message: "Forbidden: Admins only." });
  }
  next();
};

// Middleware to check User role
exports.isUser = (req, res, next) => {
  if (req.user.roleID !== "User") {
    return res.status(403).json({ success: false, message: "Forbidden: Users only." });
  }
  next();
};
