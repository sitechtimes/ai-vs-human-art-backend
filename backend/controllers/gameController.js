const Game = require("../models/gameModel");
const mongoose = require("mongoose");

async function saveGame(req, res) {
  const { right, total } = req.body;

  console.log(req.body);

  if (!right || !total) {
    return res.status(422).json({ message: "Invalid fields" });
  }

  try {
    await Game.create({
      right,
      total,
    });
    return res.sendStatus(201);
  } catch (error) {
    return res.status(400).json({ message: "Could not save game" });
  }
}

module.exports = { saveGame };
