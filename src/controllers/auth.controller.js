const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { authenticate, secretKey } = require("../middlewares/auth.middleware");
const { token } = require("morgan");

exports.Register = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;

    if (!userName || !email || !password || !role) {
      return res.status(400).json({ message: "Required!!!" });
    }

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

    res.json({ accessToken, refreshToken });
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

    if (!req.user || !req.user.refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Filter out the provided refresh token
    req.user.refreshToken = req.user.refreshToken.filter(
      (token) => token !== refreshToken
    );

    await req.user.save();

    res.status(200).json({ message: "Logout successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
