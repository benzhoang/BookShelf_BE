const express = require("express");
const router = express.Router();
const BookController = require("../controllers/book.controller");

const {
    authenticate,
    authorizeAdmin,
    authorizeCustomer,
    authorizeManager,
    authorizeStaff,
  } = require("../middlewares/auth.middleware");

router.get("/", BookController.getAllBooks);
router.post("/", authorizeAdmin, BookController.createBook);
router.get("/:id", BookController.getBookById);
router.delete("/:id", authorizeAdmin, BookController.deleteBook);


module.exports = router;
