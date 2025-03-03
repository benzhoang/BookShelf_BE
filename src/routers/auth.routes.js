const express = require("express");
const passport = require("passport");
const AuthController = require("../controllers/auth.controller");
const {
  authenticate,
  authorizeAdmin,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Google OAuth Login
router.get(
  "/login/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "Customer", 
  })
);

router.get(
  "/login/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user) => {
      if (err || !user) {
        return res.redirect(req.query.state?.split(",")[1]);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  AuthController.googleAuthCallback
);

// 🔑 Standard Login
router.post("/login", AuthController.Login);

// 🔑 Register
router.post("/register", AuthController.Register);

// RefreshToken
router.post("/refreshToken", AuthController.refreshToken);

// 🚪 Logout
router.post("/logout", authenticate, AuthController.Logout);


// 🔒 Protected Routes
router.get("/admin/dashboard", authenticate, authorizeAdmin, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});

router.get("/user/dashboard", authenticate, (req, res) => {
  res.json({ message: "Welcome to User Dashboard" });
});

module.exports = router;
