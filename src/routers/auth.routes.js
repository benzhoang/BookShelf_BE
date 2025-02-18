const express = require("express");
const passport = require("passport");
const AuthController = require("../controllers/auth.controller");
const {
  authenticate,
  authorizeAdmin,
  authorizeStaff,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Google Authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
    res.json({ success: true, token: req.user.token });
  }
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
