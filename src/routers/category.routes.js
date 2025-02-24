const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/category.controller");


router.get("/", CategoryController.getAllCategory);
// router.post("/", BookController.createBook);
// router.get("/:id", BookController.getBookById);
// router.delete("/:id", BookController.deleteBook);


module.exports = router;
