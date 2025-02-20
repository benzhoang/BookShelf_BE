const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const passport = require("passport");
require("dotenv").config();
const User = require("../models/user.model");

const secretKey = "your-secret-key";

const jwtOptions = {
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

const jwtStrategy = new passportJWT.Strategy(
  jwtOptions,
  async (payload, done) => {
    try {
      const user = await User.findById(payload.sub);
      if (user) return done(null, user);
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }
);

passport.use(jwtStrategy);

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

module.exports = { authenticate, authorizeAdmin, authorizeManager, authorizeStaff, authorizeCustomer, secretKey };
