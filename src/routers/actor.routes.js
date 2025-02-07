const express = require("express");
const router = express.Router();
const ActorController = require("../controllers/actor.controller");

/**
 * @swagger
 * tags:
 *   name: Actors
 *   description: API for managing actors
 */

router.get("/", ActorController.getAllActor);
/**
 * @swagger
 * /actors:
 *   get:
 *     summary: Retrieve all actors
 *     tags: [Actors]
 *     responses:
 *       200:
 *         description: A list of actors
 */

router.post("/", ActorController.createActor);
/**
 * @swagger
 * /actors:
 *   post:
 *     summary: Create a new actor
 *     tags: [Actors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: ObjectId
 *             properties:
 *               actorName:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Actor created successfully
 */

router.get("/:id", ActorController.getActorById);
/**
 * @swagger
 * /actors/{id}:
 *   get:
 *     summary: Get actor by ID
 *     tags: [Actors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: ObjectId
 *         description: The actor ID
 *     responses:
 *       200:
 *         description: Actor details
 */

router.put("/:id", ActorController.updateActor);
/**
 * @swagger
 * /actors/{id}:
 *   put:
 *     summary: Update an actor
 *     tags: [Actors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: ObjectId
 *             properties:
 *               actorName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Actor updated successfully!!!
 */

router.delete("/:id", ActorController.deleteActor);
/**
 * @swagger
 * /actors/{id}:
 *   delete:
 *     summary: Delete an actor
 *     tags: [Actors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: ObjectId
 *     responses:
 *       200:
 *         description: Actor deleted successfully!!!
 */

module.exports = router;
