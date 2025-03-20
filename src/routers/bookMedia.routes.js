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
router.post("/", authenticate, authorizeAdmin, BookMediaController.createBookMedia);
router.get("/:id", BookMediaController.getBookMediaById);
router.put("/:id", authenticate, authorizeAdmin, BookMediaController.updateBookMedia);
router.delete("/:id", authenticate, authorizeAdmin, BookMediaController.deleteBookMedia);

module.exports = router;
