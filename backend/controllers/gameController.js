const Game = require("../models/gameModel");

async function saveGame(req, res) {
  const { right, total, user } = req.body;

  if (!right || !total) {
    return res.status(422).json({ message: "Invalid fields" });
  }
  await Game.create({
    right,
    total,
    time: Date.now(),
    user,
  });
}

module.exports = { saveGame };
