const Game = require("../models/gameModel");
const User = require("../models/user");
const mongoose = require("mongoose");

async function saveGame(req, res) {
  const { right, total, userId } = req.body;

  if (!right || !total) {
    return res.status(422).json({ message: "Invalid fields" });
  }

  if (!userId) {
    return res.status(422).json({ message: "No user sent." });
  }
  try {
    const id = new mongoose.Types.ObjectId(`${userId}`);
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user corresponds to sent id." });
    }

    await Game.create({
      right,
      total,
      user,
    });
    return res.sendStatus(201);
  } catch (error) {
    return res.status(400).json({ message: "Could not save game" });
  }
}

module.exports = { saveGame };
