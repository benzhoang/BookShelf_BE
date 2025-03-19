const Book = require("../models/book.model");
const Category = require("../models/category.model");
const Actor = require("../models/actor.model");
const BookMedia = require("../models/bookMedia.model");
const upload = require("../configs/upload.config");

exports.getAllBooks = async (req, res) => {
  try {
    const { categoryName, origin, actorName } = req.query;

    // Build a query object
    let query = {};

    if (categoryName) {
      const category = await Category.findOne({ categoryName });
      console.log(category);
      if (category) {
        query.category = category._id;
      } else {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    if (origin) {
      const bookMedia = await BookMedia.findOne({ origin });
      if (bookMedia) {
        query.bookMediaID = bookMedia._id;
      } else {
        return res.status(404).json({ message: "Book media not found" });
      }
    }

    if (actorName) {
      const actor = await Actor.findOne({ actorName });
      if (actor) {
        query.actorID = actor._id;
      } else {
        return res.status(404).json({ message: "Actor not found" });
      }
    }
    console.log(query);
    const books = await Book.find(query).populate([
      { path: "category", select: 'categoryName' },
      { path: "bookMedia", select: 'origin' },
      { path: "actor", select: 'actorName' },
    ]);
    console.log(books);
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// exports.getAllBooks = async (req, res) => {
//   try {
//     const { categoryName, origin, actorName } = req.query;

//     let query = {};

//     if (categoryName) {
//       const category = await Category.findOne({ categoryName });
//       if (category) {
//         query.categoryID = category._id;
//       } else {
//         return res.status(404).json({ message: "Category not found" });
//       }
//     }

//     if (origin) {
//       const bookMedia = await BookMedia.findOne({ origin });
//       if (bookMedia) {
//         query.bookMediaID = bookMedia._id;
//       } else {
//         return res.status(404).json({ message: "Book media not found" });
//       }
//     }

//     if (actorName) {
//       const actor = await Actor.findOne({ actorName });
//       if (actor) {
//         query.actorID = actor._id;
//       } else {
//         return res.status(404).json({ message: "Actor not found" });
//       }
//     }

//     const books = await Book.aggregate([
//       { $match: query }, // Lọc sách theo điều kiện
//       {
//         $lookup: {
//           from: "InvoiceDetails",
//           localField: "_id",
//           foreignField: "book",
//           as: "soldData"
//         }
//       },
//       {
//         $addFields: {
//           totalSold: { $sum: "$soldData.quantity" }, // Tính tổng số lượng đã bán
//           availableStock: { $subtract: ["$quantity", { $sum: "$soldData.quantity" }] } // Số lượng tồn kho
//         }
//       },
//       {
//         $lookup: { from: "categories", localField: "categoryID", foreignField: "_id", as: "category" }
//       },
//       {
//         $lookup: { from: "bookmedias", localField: "bookMediaID", foreignField: "_id", as: "bookMedia" }
//       },
//       {
//         $lookup: { from: "actors", localField: "actorID", foreignField: "_id", as: "actor" }
//       },
//       {
//         $project: {
//           _id: 1,
//           // title: 1,
//           bookName: 1,
//           image: 1,
//           description: 1,
//           price: 1,
//           category: { $arrayElemAt: ["$category.categoryName", 0] },
//           bookMedia: { $arrayElemAt: ["$bookMedia.origin", 0] },
//           actor: { $arrayElemAt: ["$actor.actorName", 0] },
//           quantity: 1,
//           totalSold: 1,
//           availableStock: 1
//         }
//       }
//     ]);

//     res.status(200).json(books);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


exports.createBook = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    const { bookName, description, price, categoryName, actorName, origin, quantity } = req.body;
    const user = req.user._id;

    if (!categoryName || !actorName || !origin) {
      return res.status(400).json({ message: "Category, actor, and origin are required!" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Lấy URL ảnh đã upload
    const imageUrl = req.file.path;

    // Tìm category, bookMedia, bookName song song để giảm thời gian truy vấn
    const [category, bookMedia, bookNameExists] = await Promise.all([
      Category.findOne({ categoryName }),
      BookMedia.findOne({ origin }),
      Book.findOne({ bookName }),
    ]);

    if (bookNameExists) return res.status(400).json({ message: "Book name already exists" });
    if (!category) return res.status(404).json({ message: "Category not found!" });
    if (!bookMedia) return res.status(404).json({ message: "Book media not found!" });

    // Kiểm tra và tạo actor nếu chưa tồn tại
    let actor = await Actor.findOne({ actorName });
    if (!actor) {
      actor = new Actor({ actorName });
      await actor.save();
    }

    // Tạo sách mới
    const newBook = new Book({
      bookName,
      description,
      price,
      image: imageUrl, // Lưu URL ảnh
      category: category._id,
      actor: actor._id,
      bookMedia: bookMedia._id,
      quantity,
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
      { path: "category", select: 'categoryName' },
      { path: "bookMedia", select: 'origin' },
      { path: "actor", select: 'actorName' },
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

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      bookName,
      description,
      price,
      categoryName,
      actorName,
      origin,
      image,
      soldBook,
      quantity,
    } = req.body;

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book id not found!!!" });

    const category = await Category.findOne({ categoryName });
    const bookMedia = await BookMedia.findOne({ origin });
    const bookNameExits = await Book.findOne({ bookName });

    if (bookNameExits)
      return res.status(404).json({ message: "Book name already exits!!!" });

    if (!category)
      return res.status(404).json({ message: "Category not found!" });
    if (!bookMedia)
      return res.status(404).json({ message: "Book media not found!" });

    // Find or create actor
    let actor = await Actor.findOne({ actorName });
    if (!actor) {
      actor = new Actor({ actorName });
      await actor.save();
    }

    // Update book details
    book.bookName = bookName || book.bookName;
    book.description = description || book.description;
    book.price = price || book.price;
    book.image = image || book.image;
    book.category = category._id;
    book.actor = actor._id;
    book.bookMedia = bookMedia._id;
    book.soldBook = soldBook || book.soldBook;
    book.quantity = quantity || book.quantity;

    await book.save();
    res.status(200).json({ message: "Book updated successfully!", book });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
