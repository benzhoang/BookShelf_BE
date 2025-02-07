const express = require("express");
const router = express();
const UserController = require("../controllers/user.controller")

router.get("/", UserController.getAllUser);
router.get("/:id", UserController.getUserById);

module.exports = router;