const express = require("express");
const router = express.Router();
const ActorController = require("../controllers/actor.controller");

const {
  authenticate,
  authorizeAdmin,
  authorizeCustomer,
  authorizeManager,
  authorizeStaff,
} = require("../middlewares/auth.middleware");

router.get("/", ActorController.getAllActor);

router.post("/", authenticate, authorizeAdmin, ActorController.createActor);

router.get("/:id", authenticate, ActorController.getActorById);

router.put("/:id", authenticate, authorizeAdmin, ActorController.updateActor);

router.delete("/:id", authenticate, authorizeAdmin, ActorController.deleteActor);

module.exports = router;
