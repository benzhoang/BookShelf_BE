// auth.middleware.js
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
      const user = await User.findById(payload.sub);
      return done(null, user || false);
    } catch (err) {
      return done(err, false);
    }
  })
);

const authenticate = passport.authenticate("jwt", { session: false });

const authorizeRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = {
  authenticate,
  authorizeAdmin: authorizeRole("Admin"),
  authorizeStaff: authorizeRole("Staff"),
  secretKey,
};
