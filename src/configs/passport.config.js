const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/user.model");
const { secretKey } = require("../middlewares/auth.middleware");
require("dotenv").config();

// 🔐 JWT Strategy
passport.use(
  new JwtStrategy(
    {
      secretOrKey: secretKey,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        return done(null, user || false);
      } catch (error) {
        console.error("JWT Auth Error:", error);
        return done(error, false);
      }
    }
  )
);

// 🔗 Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || process.env.GOOGLE_CALLBACK_DEV,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          const validRoles = ["Admin", "Manager", "Customer", "Staff"];
          const requestedRole =
            req.query.state?.charAt(0).toUpperCase() +
            req.query.state?.slice(1);
          const role = validRoles.includes(requestedRole)
            ? requestedRole
            : "Customer";

          user = await User.create({
            userName: profile.displayName,
            email,
            googleId: profile.id,
            isActive: true,
            role,
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
