const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { authenticate, secretKey } = require("../middlewares/auth.middleware");
const { token } = require("morgan");
const bcrypt = require('bcrypt')

exports.googleAuthCallback = async (req, res) => {
  if (!req.user) {
    return res
      .status(400)
      .json({ success: false, message: "Authentication failed" });
  }

  try {
    // Generate access token
    const accessToken = jwt.sign(
      { id: req.user._id, role: req.user.role },
      secretKey,
      { expiresIn: "15m" } // Short-lived access token (15 minutes)
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: req.user._id },
      secretKey,
      { expiresIn: "7d" } // Longer-lived refresh token (7 days)
    );

    // Save refresh token in the database
    await User.findByIdAndUpdate(req.user._id, {
      $push: { refreshToken: refreshToken },
      $set: { accessToken: [accessToken] }
    });

    // Return both tokens
    res.json({ success: true, accessToken, refreshToken });
  } catch (error) {
    console.error("Error processing authentication:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.Register = async (req, res, next) => {
  try {
    const { userName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exits!!!" });

    // const user = await User.findOne({ refreshToken: { $in: [refreshToken] } });

    const newUser = new User({
      userName,
      email,
      password,
      role,
    });

    bcrypt.hash(newUser.password, 10, async function (err, hash) {
      if (err) throw err;
      newUser.password = hash
      await newUser.save()
        .then((user) => {
          res.status(201).json({ message: "Register successfully", user: user });
        })
        .catch(next);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const matchPassword = await bcrypt.compare(password, user.password)

    if (!user && !matchPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = jwt.sign({ id: user._id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, secretKey, {
      expiresIn: "7d",
    });

    // user.refreshToken.push(refreshToken);
    user.refreshToken = refreshToken;
    // user.accessToken = accessToken;
    await user.save();

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh Token is required" });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, secretKey, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Find the user associated with this refresh token
      const user = await User.findOne({ refreshToken });

      if (!user) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { id: user._id, role: user.role },
        secretKey,
        { expiresIn: "15m" } // 15-minute access token
      );

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.Logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Find user with this refreshToken
    const user = await User.findOne({ refreshToken: refreshToken });

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    console.log("Before Removal:", user.refreshToken);

    // Remove refreshToken safely
    user.refreshToken = user.refreshToken.filter(
      (token) => token.toString() !== refreshToken
    );

    // Clear access tokens (if stored)
    if (user.accessToken) {
      user.accessToken = [];
    }

    await user.save();

    console.log("After Removal:", user.refreshToken);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

