const express = require("express");
const router = express.Router(); // new router object
const itemController = require("../../controllers/itemController");
const adminMiddleware = require("../../middleware/admin");
const authMiddleware = require("../../middleware/auth");
const cloudConfig = require("../../config/storage");
router.get("/test", (req, res) => {
  res.json({ message: "Test" });
});
/* router.post(
  "/uploadz",
  adminMiddleware,
  cloudConfig.upload.single("image"),
  itemController.uploadImage
); */
router.post(
  "/upload",
  adminMiddleware,
  cloudConfig.upload.array("image"),
  itemController.uploadManyImages
);
router.post(
  "/upload/profile-picture",
  authMiddleware,
  cloudConfig.upload.single("image"),
  itemController.uploadProfilePicture
);
router.get("/gallery", itemController.grabImages); // no admin middleware -- anyone should be able to view these images. this can be changed also
router.get("/random", itemController.grabRandomImage);
router.get("/tags/:tag", itemController.grabImageByTag);
// switched from parameters to queries
module.exports = router;
