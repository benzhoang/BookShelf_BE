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

router.get("/", authenticate, ActorController.getAllActor);

router.post("/", authorizeAdmin, ActorController.createActor);

router.get("/:id", authenticate, ActorController.getActorById);

router.put("/:id", authorizeAdmin, ActorController.updateActor);

router.delete("/:id", authorizeAdmin, ActorController.deleteActor);

module.exports = router;
