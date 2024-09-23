const express = require("express");
const router = express.Router();
const itemControllers = require("../../controllers/itemController");
router.post("/gallery", itemControllers.displayGallery);
module.exports = router;
