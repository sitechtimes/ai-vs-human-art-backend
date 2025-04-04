const Game = require("../models/gameModel");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

async function saveGame(req, res) {
  const { right, total, userId } = req.body;

  if (!right || !total) {
    return res.status(422).json({ message: "Invalid fields" });
  }

  if (!userId) {
    return res.status(422).json({ message: "No user sent." });
  }

  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });

  if (!user) {
    return res.status(404).json({ message: "No user corrsponds to sent id." });
  }

  await Game.create({
    right,
    total,
    time: Date.now(),
    user,
  });
}

module.exports = { saveGame };
