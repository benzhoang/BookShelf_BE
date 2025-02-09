const express = require("express");
const router = express.Router();
const BookController = require("../controllers/book.controller");


router.get("/", BookController.getAllBooks);
// router.post("/", BookController.createBook);
router.get("/:id", BookController.getBookById);
router.delete("/:id", BookController.deleteBook);


module.exports = router;
