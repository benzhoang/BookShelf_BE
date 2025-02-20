const express = require("express");
const router = express();
const RoleController = require("../controllers/role.controller")

router.get("/", RoleController.getAllRole);
router.get("/:id", RoleController.getRoleById);

module.exports = router;