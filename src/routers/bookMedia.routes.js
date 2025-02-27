const express = require("express");
const router = express();
const BookMediaController = require("../controllers/bookMedia.controller");

const {
    authenticate,
    authorizeAdmin,
    authorizeCustomer,
    authorizeManager,
    authorizeStaff,
  } = require("../middlewares/auth.middleware");

router.get("/", BookMediaController.getAllBookMedia);
router.get("/:id", BookMediaController.getBookMediaById);
router.post("/", authorizeAdmin, BookMediaController.createBookMedia);
router.post("/", authorizeAdmin, BookMediaController.deleteBookMedia);

module.exports = router;
