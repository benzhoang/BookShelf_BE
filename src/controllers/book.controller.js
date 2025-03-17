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
        query.categoryID = category._id;
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

    const books = await Book.find(query).populate([
      { path: "categoryID" },
      { path: "bookMediaID" },
      { path: "actorID" },
    ]);

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
    const {
      bookName,
      description,
      price,
      categoryName,
      actorName,
      origin,
      quantity,
      imageUrls,
    } = req.body;
    const user = req.user._id;

    if (!categoryName || !actorName || !origin) {
      return res
        .status(400)
        .json({ message: "Category, actor, and origin are required!" });
    }

    const category = await Category.findOne({ categoryName });

    const bookMedia = await BookMedia.findOne({ origin });

    const bookNameExits = await Book.findOne({ bookName });

    let actor = await Actor.findOne({ actorName });
    if (!actor) {
      actor = new Actor({ actorName });
      await actor.save();
    }

    if (bookNameExits)
      return res.status(404).json({ message: "Book name alredy exits" });

    if (!category)
      return res.status(404).json({ message: "Category not found!" });
    if (!bookMedia)
      return res.status(404).json({ message: "Book media not found!" });

    const newBook = new Book({
      bookName,
      description,
      price,
      image: imageUrls, // Lưu danh sách URL ảnh đã upload
      categoryID: category._id,
      actorID: actor._id,
      bookMediaID: bookMedia._id,
      quantity
    });

    await newBook.save();
    res
      .status(201)
      .json({ message: "Book created successfully!", book: newBook });
  } catch (error) {
    console.error("Error creating book:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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
