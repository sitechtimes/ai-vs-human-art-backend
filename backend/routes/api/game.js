const express = require("express");
const router = express.Router();
const gameController = require("../../controllers/gameController");

router.post("/savegame", gameController.saveGame);

module.exports = router;
