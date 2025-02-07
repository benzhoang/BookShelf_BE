const express = require("express");
const router = express.Router();
const BookController = require("../controllers/book.controller");

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API for managing books
 */

router.get("/", BookController.getAllBooks);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of books
 */

// router.post("/", BookController.createBook);

router.get("/:id", BookController.getBookById);
/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: ObjectId
 *         description: The actor ID
 *     responses:
 *       200:
 *         description: Books details
 */

router.delete("/:id", BookController.deleteBook);
/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a books by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: ObjectId
 *     responses:
 *       200:
 *         description: BookId deleted successfully!!!
 */



module.exports = router;
