const Book = require("../models/book.model");
const Category = require("../models/category.model");

exports.getAllCategory = async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
