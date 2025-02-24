const passport = require("passport");
const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");
const User = require("../models/user.model");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY || "your-secret-key";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      return done(null, user || false);
    } catch (err) {
      console.error("JWT Authentication Error:", err);
      return done(err, false);
    }
  })
);

const authenticate = passport.authenticate("jwt", { session: false });

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

const authorizeManager = (req, res, next) => {
  if (req.user.role !== "Manager") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

const authorizeCustomer = (req, res, next) => {
  if (req.user.role !== "Customer") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

const authorizeStaff = (req, res, next) => {
  if (req.user.role !== "Staff") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

<<<<<<< HEAD
module.exports = { authenticate, authorizeAdmin, authorizeManager, authorizeStaff, authorizeCustomer, secretKey };
=======
module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeStaff,
  secretKey,
};
>>>>>>> 917f88ffe5ea0f24e66a0f3e34ea1418312f66ea
