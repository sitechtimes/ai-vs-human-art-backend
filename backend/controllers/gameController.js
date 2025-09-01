const Game = require("../models/gameModel");

async function saveGame(req, res) {
  const { right, total } = req.body;

  if (!right || !total) {
    return res.status(422).json({ message: "Invalid fields" });
  }

  try {
    const game = await Game.create({
      right,
      total,
    });

    const id = game._id;

    return res.json(id).status(201);
  } catch (error) {
    return res.status(400).json({ message: "Could not save game", error });
  }
}

module.exports = { saveGame };
