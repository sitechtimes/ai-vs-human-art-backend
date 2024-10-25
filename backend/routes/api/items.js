const express = require("express");
const router = express.Router(); // new router object
const itemController = require("../../controllers/itemController");
const adminMiddleware = require("../../middleware/admin");
const cloudConfig = require("../../config/storage");
router.get("/test", (req, res) => {
  res.json({ message: "Test" });
});
router.post(
  "/upload",
  adminMiddleware,
  cloudConfig.upload.single("image"),
  itemController.uploadImage
);
router.get("/random", itemController.grabRandomImage);
router.get("/gallery", itemController.grabImages); // no admin middleware -- anyone should be able to view these images. this can be changed also
// switched from parameters to queries
module.exports = router;
