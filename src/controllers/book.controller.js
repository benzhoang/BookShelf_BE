const Book = require("../models/book.model");
const Category = require("../models/category.model");
const Actor = require("../models/actor.model");
const BookMedia = require("../models/bookMedia.model");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate([
      { path: "categoryID" },
      { path: "bookMediaID" },
      { path: "actorID" },
    ]);

    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { bookName, description, price, categoryName, actorName, origin, imageURL } = req.body;

    if (!categoryName || !actorName || !origin) {
      return res.status(400).json({ message: "Category, actor, and origin are required!" });
    }

    const category = await Category.findOne({ name: categoryName });
    const actor = await Actor.findOne({ name: actorName });
    const bookMedia = await BookMedia.findOne({ origin });

    if (!category) return res.status(404).json({ message: "Category not found!" });
    if (!actor) return res.status(404).json({ message: "Actor not found!" });
    if (!bookMedia) return res.status(404).json({ message: "Book media not found!" });

    const newBook = new Book({
      bookName,
      description,
      price,
      imageURL, 
      categoryID: category._id,
      actorID: actor._id,
      bookMediaID: bookMedia._id,
    });

    await newBook.save();

    res.status(201).json({ message: "Book created successfully!", book: newBook });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found!!!" });
    } else {
      res.status(200).json({ message: "Delete book successfully!!!" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate([
      { path: "categoryID" },
      { path: "bookMediaID" },
      { path: "actorID" },
    ]);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      res.status(200).json(book);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
