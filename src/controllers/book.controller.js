const Book = require("../models/book.model");
const Category = require("../models/category.model");
const Actor = require("../models/actor.model");
const BookMedia = require("../models/bookMedia.model");
const upload = require("../configs/upload.config");
const InvoiceDetail = require("../models/invoiceDetails.model");

const QRCode = require("qrcode");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const path = require("path");

exports.getAllBooks = async (req, res) => {
  try {
    const { bookName, categoryName, origin, actorName } = req.query;

    // Build a query object
    let query = {};

    if (bookName) {
      const book = await Book.findOne({ bookName });
      console.log(book);
      if (book) {
        query._id = book._id;
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    }

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

    const books = await Book.find(query).populate([
      { path: "category", select: "categoryName" },
      { path: "bookMedia", select: "origin" },
      { path: "actor", select: "actorName" },
    ]);

    const Books = await Promise.all(
      books.map(async (book) => {
        const invoiceDetails = await InvoiceDetail.find({ bookID: book._id });
        const totalSold = invoiceDetails.reduce(
          (sum, detail) => sum + detail.quantity,
          0
        );
        return {
          ...book.toObject(),
          soldQuantity: totalSold,
        };
      })
    );

    res.status(200).json(Books);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// exports.getAllBooks = async (req, res) => {
//   try {
//     const { categoryName, origin, actorName } = req.query

//     let query = {}

//     if (categoryName) {
//       const category = await Category.findOne({ categoryName })
//       if (category) {
//         query.categoryID = category._id
//       } else {
//         return res.status(404).json({ message: "Category not found" })
//       }
//     }

//     if (origin) {
//       const bookMedia = await BookMedia.findOne({ origin })
//       if (bookMedia) {
//         query.bookMediaID = bookMedia._id
//       } else {
//         return res.status(404).json({ message: "Book media not found" })
//       }
//     }

//     if (actorName) {
//       const actor = await Actor.findOne({ actorName })
//       if (actor) {
//         query.actorID = actor._id
//       } else {
//         return res.status(404).json({ message: "Actor not found" })
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
//     ])

//     res.status(200).json(books)
//   } catch (error) {
//     res.status(400).json({ message: error.message })
//   }
// }

exports.createBook = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    const {
      bookName,
      description,
      price,
      categoryName,
      actorName,
      origin,
      quantity,
      imageUrl,
    } = req.body;

    if (!categoryName || !actorName || !origin) {
      return res
        .status(400)
        .json({ message: "Category, actor, and origin are required!" });
    }

    // Xác định URL ảnh:
    let finalImageUrl;
    if (req.file) {
      finalImageUrl = req.file.path; // Nếu có file ảnh, lấy từ Cloudinary
    } else if (imageUrl) {
      finalImageUrl = imageUrl; // Nếu người dùng nhập URL ảnh, sử dụng URL đó
    }

    // Kiểm tra danh mục, phương tiện sách, và tên sách
    const category = await Category.findOne({ categoryName });
    const bookMedia = await BookMedia.findOne({ origin });
    const bookNameExists = await Book.findOne({ bookName });

    if (bookNameExists)
      return res.status(400).json({ message: "Book name already exists" });
    if (!category)
      return res.status(404).json({ message: "Category not found!" });
    if (!bookMedia)
      return res.status(404).json({ message: "Book media not found!" });

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
      image: finalImageUrl,
      category: category._id,
      actor: actor._id,
      bookMedia: bookMedia._id,
      quantity,
    });

    // Tạo mã QR
    const qrData = JSON.stringify({
      id: newBook._id,
      bookName: newBook.bookName,
    });
    const qrPath = path.join(__dirname, `../temp/${newBook._id}.png`);
    await QRCode.toFile(qrPath, qrData);

    // Upload QR lên Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(qrPath, {
      folder: "qrcodeOfBook",
      public_id: `qr_${newBook._id}`,
      overwrite: true,
    });

    // Xóa file QR tạm thời
    fs.unlinkSync(qrPath);

    // Cập nhật URL QR vào cloud
    newBook.qrCode = uploadResponse.secure_url;
    await newBook.save();

    res
      .status(201)
      .json({ message: "Book created successfully!", book: newBook });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    const invoiceDetails = await InvoiceDetail.findOne({ bookID: book._id });
    if (invoiceDetails)
      return res.status(400).json({ message: "Book have invoice " });
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
      { path: "category", select: "categoryName" },
      { path: "bookMedia", select: "origin" },
      { path: "actor", select: "actorName" },
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
      quantity,
    } = req.body;

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book id not found!!!" });

    const category = await Category.findOne({ categoryName });
    const bookMedia = await BookMedia.findOne({ origin });
    const bookNameExits = await Book.findOne({ bookName });
    const invoiceDetails = await InvoiceDetail.findOne({ bookID: id });
    if (invoiceDetails)
      return res.status(400).json({ message: "Book have invoice " });

    if (bookNameExits && !book._id.equals(bookNameExits._id))
      return res.status(404).json({ message: "Book name already exists!!!" });

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

    // Kiểm tra nếu book chưa có QR hoặc bookName thay đổi
    let shouldUpdateQR =
      !book.qrCode || (bookName && bookName !== book.bookName);

    if (shouldUpdateQR) {
      const qrData = JSON.stringify({
        id: book._id,
        bookName: bookName || book.bookName,
      });
      const qrPath = path.join(__dirname, `../temp/${book._id}.png`);

      await QRCode.toFile(qrPath, qrData);

      const uploadResponse = await cloudinary.uploader.upload(qrPath, {
        folder: "qrcodeOfBook",
        public_id: `QR_${book._id}`,
        overwrite: true,
      });

      fs.unlinkSync(qrPath);
      book.qrCode = uploadResponse.secure_url;
    }

    // Cập nhật thông tin sách
    book.bookName = bookName || book.bookName;
    book.description = description || book.description;
    book.price = price || book.price;
    book.image = image || book.image;
    book.category = category._id;
    book.actor = actor._id;
    book.bookMedia = bookMedia._id;
    book.quantity = quantity || book.quantity;

    await book.save();
    res.status(200).json({ message: "Book updated successfully!", book });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
