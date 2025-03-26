const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

const {
  authenticate,
  authorizeAdmin,
} = require("../middlewares/auth.middleware");

router.get("/", authenticate, authorizeAdmin, UserController.getAllUser);
router.get("/profile", authenticate, UserController.getProfile);
router.get("/profile/:id", authenticate, authorizeAdmin, UserController.getUserById);
router.delete("/:id", authenticate, authorizeAdmin, UserController.deleteUser);

module.exports = router;
