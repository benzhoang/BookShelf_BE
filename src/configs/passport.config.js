// passport.config.js
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/user.model");
const { secretKey } = require("../middlewares/auth.middleware");
require("dotenv").config();

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      secretOrKey: secretKey,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.userID);
        return done(null, user || false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = await User.create({
            userName: profile.displayName,
            email: profile.emails[0].value,
            password: profile.emails[0].value,
            isActive: true,
            role: ["Admin", "User", "Staff"].includes(req.query.state?.charAt(0).toUpperCase() + req.query.state?.slice(1))
              ? req.query.state?.charAt(0).toUpperCase() + req.query.state?.slice(1)
              : "User",
          });
        }
        return done(null, user);
      } catch (err) {
        console.error("Google Auth Error:", err);
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
