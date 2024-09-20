const express = require("express");
const router = express.Router();
const Art = require("../models/artModel");

router.get("/gallery", async (req, res) => {
  try {
    artModel
      .find()
      .lean()
      .exec()
      .then((result) => {
        const artDict = result;
      });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/* router.get("/gallery/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}); */

module.exports = router;
