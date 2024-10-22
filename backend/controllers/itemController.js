const artModel = require("../models/artModel");
const cloudConfig = require("../config/storage");
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
async function displayGallery(req, res) {
  try {
    res.json(artDict);
  } catch (error) {
    console.error("Error displaying gallery:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function uploadImage(req, res) {
  const { type } = req.body;
  const { link } = req.body;
  let folderName;
  switch (type) {
    case "ai":
      folderName = "ai-art";
      break;
    case "human":
      folderName = "human-art";
      break;
    default:
      return res.status(400).json({ message: "Invalid type" });
  }
  if (!type) {
    return res.status(422).json({ message: "Invalid fields" });
  }
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    cloudConfig.cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: folderName, tags: link },
        (error, result) => {
          if (error) {
            return res
              .status(500)
              .json({ error: "Upload failed", details: error });
          }
          res.json({ url: result.secure_url });
        }
      )
      .end(req.file.buffer);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error uploading image", error: error.message });
  }
}
async function grabImages(req, res) {
  const type = req.params.type; // this is based on query instead of a paramter. prioritzed over req.body or req.params
  const fulldata = req.query.fulldata;
  if (!type) {
    return res.status(400).json({ message: "no type provided" });
  }
  const pleaseReturnFullData = fulldata === "true";
  let folderName;
  switch (type.toLowerCase()) {
    case "ai":
      folderName = "ai-art";
      break;
    case "human":
      folderName = "human-art";
      break;
    default:
      return res.status(400).json({ message: "Invalid type" });
  }
  try {
    const result = await cloudConfig.cloudinary.api.resources({
      type: "upload",
      prefix: folderName,
    });
    const folders = await cloudConfig.cloudinary.api.root_folders();
    const urls = result.resources.map((resource) => resource.secure_url);
    res.json(pleaseReturnFullData ? result : urls); // ternary operator is lit
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ message: "Failed to retrieve assets" });
  }
}
module.exports = { displayGallery, uploadImage, grabImages };
