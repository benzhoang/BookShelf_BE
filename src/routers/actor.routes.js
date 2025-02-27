const express = require("express");
const router = express.Router();
const ActorController = require("../controllers/actor.controller");

const {
  authenticate,
  authorizeAdmin,
  authorizeStaff,
} = require("../middlewares/auth.middleware");

router.get("/", authenticate, authorizeAdmin, ActorController.getAllActor);

router.post("/", ActorController.createActor);

router.get("/:id", ActorController.getActorById);

router.put("/:id", ActorController.updateActor);

router.delete("/:id", ActorController.deleteActor);

module.exports = router;
