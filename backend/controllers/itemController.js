const express = require("express");
const artModel = require("../models/artModel");
async function displayGallery(req, res, next) {
  try {
    artModel
      .find()
      .lean() // ignore hydrating
      .exec() // await
      .then((result) => {
        res.json(result);
      });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

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

module.exports = { displayGallery };
