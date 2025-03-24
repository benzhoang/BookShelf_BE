const Category = require("../models/category.model");
const Book = require("../models/book.model");

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

    if (!categoryName)
      return res.status(400).json({ message: "Category is required!" });
    const category = await Category.findOne({ categoryName });
    if (category)
      return res.status(404).json({ message: "Category name already exits!" });

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
    const categoryInBook = await Book.findOne({ category: req.params.id });
    if (categoryInBook)
      return res.status(400).json({ message: "Have category in Book!" });

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

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;

    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found!!!" });

    let categoryNameExist = await Category.findOne({ categoryName });
    console.log(categoryNameExist);
    if (categoryNameExist) {
      if (categoryNameExist._id.equals(category._id)) {
        return res.status(400).json({ message: "Category is exits" });
      }
    }

    category.categoryName = categoryName || category.categoryName;
    await category.save();
    res
      .status(200)
      .json({ message: "Category updated successfully!", category });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
