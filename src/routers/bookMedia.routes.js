const express = require("express");
const router = express();
const BookMediaController = require("../controllers/bookMedia.controller");

/**
 * @swagger
 * tags:
 *   name: Book Media
 *   description: API for managing actors
 */

router.get("/", BookMediaController.getAllBookMedia);
router.get("/:id", BookMediaController.getBookMediaById);
router.post("/", BookMediaController.createBookMedia);
/**
 * @swagger
 * /bookMedias:
 *   post:
 *     summary: Create a new book media
 *     tags: [Book Media]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: ObjectId
 *             properties:
 *               origin:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Book Media created successfully
 */

module.exports = router;
