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

// exports.createBook = async (req, res) => {
//   try {
//     const { productName, description, price, categoryID } = req.body;

//     const newBook = new Book({
//       productName,
//       description,
//       price,
//       categoryID,
//     });
//     await newBook.save();

//     res
//       .status(201)
//       .json({ message: "Create book successfully!!!", book: newBook });
//   } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(400).json({ message: error.message });
//   }
// };

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
    const book = await Book.findById(req.params.id).populate("categoryID");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      res.status(200).json(book);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
