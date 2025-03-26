const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

const {
  authenticate,
  authorizeAdmin,
} = require("../middlewares/auth.middleware");

router.get("/", authenticate, authorizeAdmin, UserController.getAllUser);
router.get("/profile", authenticate, UserController.getProfile);
router.put("/wallet", authenticate, UserController.updateWallet);

module.exports = router;
