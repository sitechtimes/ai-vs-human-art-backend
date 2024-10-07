const express = require("express");
const router = express.Router(); // new router object
const itemController = require("../../controllers/itemController");
const adminMiddleware = require("../../middleware/admin");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.get("/gallery", itemController.displayGallery);
router.get("/test", (req, res) => {
  res.json({ message: "Test" });
});
router.post(
  "/upload",
  adminMiddleware,
  upload.single("image"),
  itemController.uploadImage
);
module.exports = router;
