const express = require("express");
const passport = require("passport");
const AuthController = require("../controllers/auth.controller");
const {
  authenticate,
  isAdmin,
  isUser,
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

// Logout
router.get("/logout", AuthController.logout);

// Get current user
router.get("/user", AuthController.getCurrentUser);

// 🔒 Protected Routes
router.get("/admin/dashboard", authenticate, isAdmin, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});

router.get("/user/dashboard", authenticate, isUser, (req, res) => {
  res.json({ message: "Welcome to User Dashboard" });
});

module.exports = router;
