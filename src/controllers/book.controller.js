const Book = require("../models/book.model");
const Category = require("../models/category.model");
const Actor = require("../models/actor.model");
const BookMedia = require("../models/bookMedia.model");
const upload = require("../configs/upload.config");

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
    const { bookName, description, price, categoryName, actorName, origin, imageUrls } = req.body;

    if (!categoryName || !actorName || !origin) {
      return res.status(400).json({ message: "Category, actor, and origin are required!" });
    }

    const category = await Category.findOne({ categoryName });
    const actor = await Actor.findOne({ actorName });
    const bookMedia = await BookMedia.findOne({ origin });

    if (!category) return res.status(404).json({ message: "Category not found!" });
    if (!actor) return res.status(404).json({ message: "Actor not found!" });
    if (!bookMedia) return res.status(404).json({ message: "Book media not found!" });

    const newBook = new Book({
      bookName,
      description,
      price,
      image: imageUrls, // Lưu danh sách URL ảnh đã upload
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

// exports.uploadBook = async (req, res) => {
//   try {
//     const { bookId } = req.params; // Lấy ID sách từ URL

//     if (!bookId) return res.status(400).json({ message: "Book ID is required!" });

//     upload.single("image")(req, res, async (err) => {
//       if (err) return res.status(400).json({ message: "Image upload failed", error: err.message });

//       const imageUrl = req.file ? req.file.path : null;

//       if (!imageUrl) return res.status(400).json({ message: "No image uploaded" });

//       // Kiểm tra sách có tồn tại không
//       const book = await Book.findById(bookId);
//       if (!book) return res.status(404).json({ message: "Book not found!" });

//       // Cập nhật sách với ảnh mới
//       const updatedBook = await Book.findByIdAndUpdate(
//         bookId,
//         { $push: { image: imageUrl } }, // Thêm ảnh vào mảng `image`
//         { new: true } // Trả về dữ liệu mới nhất
//       );

//       res.status(200).json({ message: "Image uploaded successfully!", book: updatedBook });
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };