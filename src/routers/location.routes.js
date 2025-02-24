const express = require("express");
const router = express.Router();
const LocationController = require("../controllers/location.controller");


router.get("/", LocationController.getAllLocation);
// router.post("/", BookController.createBook);
// router.get("/:id", BookController.getBookById);
// router.delete("/:id", BookController.deleteBook);


module.exports = router;
