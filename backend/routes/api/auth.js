const express = require("express");
const router = express.Router(); // new router object
const authController = require("../../controllers/authController");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/refresh", authController.refresh); // auth middleware should be here and in logout

router.get("/self/", authMiddleware, authController.self);

router.get("/users/:userid", authController.user);

router.get("/admin", adminMiddleware, (req, res) => {
  res.json({ message: "Admin Test" });
});

router.patch("/highscore", authController.highScoreUpdate);
router.post("/cookieping", authController.cookiePing);

router.post("/validate", authController.validateToken);

module.exports = router;
