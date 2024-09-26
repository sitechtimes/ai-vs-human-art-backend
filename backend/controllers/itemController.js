const express = require("express");
const artModel = require("../models/artModel");

let artDict = [];
const fetchArtData = async () => {
  // separate function for safety purposes
  try {
    artDict = await artModel.find().lean(); // lean ignores hydrating. could include exec if necessary to self Await
  } catch (error) {
    console.error("Error fetching art data:", error);
  }
};

fetchArtData();
exports.displayGallery = (req, res) => {
  try {
    res.json(artDict);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
