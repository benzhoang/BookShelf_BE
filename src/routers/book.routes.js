const express = require("express");
const router = express.Router();
const BookController = require("../controllers/book.controller");
const { uploadImage } = require("../middlewares/uploadImage.middlewares");

const {
  authenticate,
  authorizeAdmin,
  authorizeCustomer,
  authorizeManager,
  authorizeStaff,
} = require("../middlewares/auth.middleware");

router.get("/", BookController.getAllBooks);
router.post("/", authenticate, authorizeAdmin, uploadImage, BookController.createBook);
router.get("/:id", BookController.getBookById);
router.delete("/:id", authenticate, authorizeAdmin, BookController.deleteBook);

// router.get("/soldBook", BookController.getSoldBooks);

router.put("/:id", authenticate, authorizeAdmin, BookController.updateBook);

module.exports = router;
