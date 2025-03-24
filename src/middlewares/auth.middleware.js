const passport = require("passport");
const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");
const User = require("../models/user.model");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

// passport.use(
//   new JwtStrategy(jwtOptions, async (payload, done) => {
//     try {
//       const user = await User.findById(payload.id);
//       return done(null, user || false);
//     } catch (err) {
//       console.error("JWT Authentication Error:", err);
//       return done(err, false);
//     }
//   })
// );

// const authenticate = passport.authenticate("jwt", { session: false });

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      if (!payload.id) return done(null, false);

      const user = await User.findById(payload.id).select("-password");
      if (!user) return done(null, false);

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return res.status(500).json({ message: "Internal Server Error" });

    if (!user)
      return res.status(401).json({ message: "Unauthorized: Invalid token" });

    req.user = user;
    req.userID = user._id.toString();
    next();
  })(req, res, next);
};

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

module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeManager,
  authorizeStaff,
  authorizeCustomer,
  secretKey,
};
