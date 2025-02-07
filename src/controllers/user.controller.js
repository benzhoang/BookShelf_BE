const User = require("../models/user.model");

exports.getAllUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserById = async (req, res)=> {
  try {
    const user = await User.findById(req.params.id).populate("roleID");
    if(!user) return res.status(404).json({message: "User not found!!!"})
      console.log("User not found with ID:", req.params.id);
      res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
