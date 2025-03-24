const Actor = require("../models/actor.model");
const Book = require("../models/book.model");

exports.getAllActor = async (req, res) => {
  try {
    const actor = await Actor.find();
    res.status(200).json(actor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createActor = async (req, res) => {
  try {
    const { actorName } = req.body;
    if (!actorName)
      return res.status(400).json({ message: "Actor name is required" });

    const exitActorName = await Actor.findOne({ actorName });

    if (exitActorName)
      return res.status(400).json({ message: "Actor name already exists!" });

    const newActor = new Actor({
      actorName,
    });

    await newActor.save();
    res
      .status(201)
      .json({ message: "Create actor successfully!!!", actor: newActor });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateActor = async (req, res) => {
  try {
    const { actorName } = req.body;

    if (!actorName)
      return res.status(404).json({ message: "Actor name is required!!!" });

    const existActorName = await Actor.findOne({ actorName });

    if (existActorName)
      return res.status(400).json({ message: "Actor name already exits" });

    const actor = await Actor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!actor) return res.status(404).json({ message: "Actor not found!!!" });
    res.status(200).json(actor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteActor = async (req, res) => {
  try {
    const actorInBook = await Book.findOne({ actor: req.params.id });
    if (actorInBook)
      return res.status(400).json({
        message: "Can not delete this actor because it is in book",
      });
    const actor = await Actor.findByIdAndDelete(req.params.id);
    if (!actor) return res.status(404).json({ message: "Actor not found!!!" });
    res.status(200).json({ message: "Delete actor successfully!!!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getActorById = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id);
    if (!actor) return res.status(404).json({ message: "Actor not found!!!" });
    res.status(200).json(actor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
