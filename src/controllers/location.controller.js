const Location = require("../models/location.model");

exports.getAllLocation = async (req, res) => {
  try {
    const location = await Location.find();
    res.status(200).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location)
      return res.status(404).json({ message: "Location not found" });
    res.status(200).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createLocation = async (req, res) => {
  try {
    const { locationName } = req.body;

    const newLocation = new Location({
      locationName,
    });
    await newLocation.save();
    res.status(201).json({
      message: "Create new location successfully",
      location: newLocation,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found!!!" });
    } else {
      res.status(200).json({ message: "Delete location successfully!!!" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};