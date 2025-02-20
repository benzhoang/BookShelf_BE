const Book = require("../models/book.model");
const Location = require("../models/location.model");

exports.getAllLocation = async (req, res) => {
  try {
    const location = await Location.find();
    res.status(200).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
