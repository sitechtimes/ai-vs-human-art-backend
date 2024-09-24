const express = require("express");
const router = express.Router();
const authControllers = require("../../controllers/authController");
const authMiddleware = require("../../middleware/auth");
const itemControllers = require("../../controllers/itemController");
router.post("/gallery", itemControllers.displayGallery);

router.post("/register", authControllers.register);

router.post("/login", authControllers.login);

router.post("/logout", authControllers.logout);

router.post("/refresh", authControllers.refresh);

router.get("/user", authMiddleware, authControllers.user);

module.exports = router;
