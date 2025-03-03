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
router.post("/",authenticate, authorizeAdmin, CategoryController.createCategory);
router.get("/:id", CategoryController.getCategoryById);
router.delete("/:id",authenticate, authorizeAdmin, CategoryController.deleteCategory);

module.exports = router;
