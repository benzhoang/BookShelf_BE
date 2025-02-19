const express = require("express");
const passport = require("passport");
const AuthController = require("../controllers/auth.controller");
const jwt = require("jsonwebtoken");
const {
  authenticate,
  authorizeAdmin,
  authorizeStaff,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "user",
  }) // Ensure state has a default value
);

// Google callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  AuthController.googleAuthCallback
);

// Login
router.post("/login", AuthController.Login);

// Register
router.post("/register", AuthController.Register);

// Logout
router.post("/logout", authenticate, AuthController.Logout);

// Get current user
router.get("/getMe", authenticate, AuthController.getMe);

// 🔒 Protected Routes
router.get("/admin/dashboard", authenticate, authorizeAdmin, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});

router.get("/user/dashboard", authenticate, (req, res) => {
  res.json({ message: "Welcome to User Dashboard" });
});

module.exports = router;
