const Category = require("../models/category.model");

exports.getAllCategory = async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    const newCategory = new Category({
      categoryName,
    });
    await newCategory.save();
    res.status(201).json({
      message: "Create new category successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
 try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found!!!" });
    } else {
      res.status(200).json({ message: "Delete category successfully!!!" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};