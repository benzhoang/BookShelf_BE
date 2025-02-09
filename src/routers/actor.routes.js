const express = require("express");
const router = express.Router();
const ActorController = require("../controllers/actor.controller");


router.get("/", ActorController.getAllActor);


router.post("/", ActorController.createActor);


router.get("/:id", ActorController.getActorById);


router.put("/:id", ActorController.updateActor);


router.delete("/:id", ActorController.deleteActor);


module.exports = router;
