const BookMedia = require("../models/bookMedia.model");
const Book = require("../models/book.model");

exports.getAllBookMedia = async (req, res) => {
  try {
    const bookMedia = await BookMedia.find();

    res.status(200).json(bookMedia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getBookMediaById = async (req, res) => {
  try {
    console.log(req.params.id);
    const bookMedia = await BookMedia.findById(req.params.id);
    if (!bookMedia)
      return res.status(404).json({ message: "Book Media not found" });
    res.status(200).json(bookMedia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createBookMedia = async (req, res) => {
  try {
    const { origin, url } = req.body;
    if (!origin || !url)
      return res
        .status(400)
        .json({ message: "Origin or url is required field" });

    const bookMediaexits = await BookMedia.findOne({ origin });
    if (bookMediaexits) {
      return res.status(400).json({ message: "Origin book media existing" });
    }

    const newBookMedia = new BookMedia({
      origin,
      url,
    });
    await newBookMedia.save();
    res.status(201).json({
      message: "Create book media successfully",
      bookMedia: newBookMedia,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBookMedia = async (req, res) => {
  try {
    const bookMediaInBook = await Book.findOne({ bookMedia: req.params.id });
    if (bookMediaInBook)
      return res.status(400).json({ message: "Have book media in Book!" });
    const book = await BookMedia.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book media not found!!!" });
    } else {
      res.status(200).json({ message: "Delete book media successfully!!!" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBookMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { origin, url } = req.body;

    // Kiểm tra xem BookMedia có tồn tại không
    const bookMedia = await BookMedia.findById(id);
    if (!bookMedia) {
      return res.status(404).json({ message: "Book media not found" });
    }

    // Kiểm tra xem origin đã tồn tại nhưng với một id khác
    const existingBookMedia = await BookMedia.findOne({ origin });
    if (existingBookMedia && !existingBookMedia._id.equals(id)) {
      return res.status(400).json({ message: "Origin already exists" });
    }

    // Cập nhật nếu hợp lệ
    bookMedia.origin = origin;
    bookMedia.url = url;
    await bookMedia.save();

    res.status(200).json({
      message: "Update book media successfully",
      bookMedia,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
