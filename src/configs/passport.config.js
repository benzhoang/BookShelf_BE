const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");
require("dotenv").config();

const jwtOptions = {
  secretOrKey: process.env.SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const jwtVerify = async (payload, done) => {
  try {
    const user = await User.findById(payload.userID);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        return done(null, user);
      }

      const validRoles = ["Admin", "User", "Staff"];
      const role = req.query.state
        ? validRoles.find(
            (r) => r.toLowerCase() === req.query.state.toLowerCase()
          ) || "User"
        : "User";

      const newUser = await User.create({
        userName: profile.displayName,
        email: profile.emails[0].value,
        password: profile.emails[0].value,
        isActive: true,
        role,
      });

      return done(null, newUser);
    } catch (err) {
      console.error("Google Auth Error:", err);
      return done(err, false);
    }
  }
);

passport.use(jwtStrategy);
passport.use(googleStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = { jwtStrategy, googleStrategy };
