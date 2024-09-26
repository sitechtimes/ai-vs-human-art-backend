const express = require("express");
const router = express.Router(); // new router object
const authController = require("../../controllers/authController");
const authMiddleware = require("../../middleware/auth");
const itemController = require("../../controllers/itemController");
router.get("/gallery", itemController.displayGallery);

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/refresh", authController.refresh);

router.get("/user", authMiddleware, authController.user);

module.exports = router;
