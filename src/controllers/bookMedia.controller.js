const BookMedia = require("../models/bookMedia.model");

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
    const { origin } = req.body;

    const newBookMedia = new BookMedia({
      origin,
    });
    await newBookMedia.save();
    res.status(201).json({
      message: "Create book media succesfully",
      bookMedia: newBookMedia,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
