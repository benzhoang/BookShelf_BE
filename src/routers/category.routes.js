const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/category.controller");

const {
    authenticate,
    authorizeAdmin,
    authorizeCustomer,
    authorizeManager,
    authorizeStaff,
} = require("../middlewares/auth.middleware");

router.get("/", CategoryController.getAllCategory);
router.post("/", authorizeAdmin, CategoryController.createCategory);
router.get("/:id", CategoryController.getCategoryById);
router.delete("/:id", authorizeAdmin, CategoryController.deleteCategory);

module.exports = router;
