const express = require("express");
const router = express();
const BookMediaController = require("../controllers/bookMedia.controller");


router.get("/", BookMediaController.getAllBookMedia);
router.get("/:id", BookMediaController.getBookMediaById);
router.post("/", BookMediaController.createBookMedia);

module.exports = router;
