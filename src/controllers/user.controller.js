const User = require("../models/user.model");

exports.getAllUser = async (req, res) => {
  try {
    const user = await User.find().select(
      "-password -accessToken -refreshToken"
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    console.log("🔹 Checking user authentication...");

    if (!req.user || !req.user._id) {
      console.log("Unauthorized request: Missing user");
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const userId = req.user._id;
    console.log("Authenticated User ID:", userId);

    const user = await User.findById(userId).select(
      "-password -accessToken -refreshToken"
    );

    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔹 Fetching user with ID:", id);

    const user = await User.findById(id).select("-password -accessToken -refreshToken");

    if (!user) {
      console.log("User not found with ID:", id);
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔹 Deleting user with ID:", id);

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      console.log("User not found with ID:", id);
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

