const express = require("express");
const router = express.Router(); // new router object
const authController = require("../../controllers/authController");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/refresh", authController.refresh);

router.get("/user", authMiddleware, authController.user);

router.get("/admin", adminMiddleware, (req, res) => {
  res.json({ message: "Admin Test" });
});

module.exports = router;
