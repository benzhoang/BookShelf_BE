const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { authenticate, secretKey } = require("../middlewares/auth.middleware");
const { token } = require("morgan");

exports.Register = async (req, res) => {
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

    await newUser.save();
    res.status(201).json({ message: "Register successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = jwt.sign({ sub: user._id }, secretKey, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ sub: user._id }, secretKey, {
      expiresIn: "7d",
    });

    // user.refreshToken.push(refreshToken);
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save();

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.Logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Find user who has this refreshToken
    const user = await User.findOne({ refreshToken: { $in: [refreshToken] } });
    console.log(user);

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Remove the refreshToken from user's list
    user.refreshToken = user.refreshToken.filter(
      (token) => token !== refreshToken
    );
    user.accessToken = []; // Clear access tokens as well
    await user.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
