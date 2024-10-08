const express = require("express");
const router = express.Router(); // new router object
const itemController = require("../../controllers/itemController");
const adminMiddleware = require("../../middleware/admin");
const cloudinarySet = require("../../config/storage");
router.get("/gallery", itemController.displayGallery);
router.get("/test", (req, res) => {
  res.json({ message: "Test" });
});
router.post(
  "/upload",
  adminMiddleware,
  cloudinarySet.upload.single("image"),
  itemController.uploadImage
);
module.exports = router;
