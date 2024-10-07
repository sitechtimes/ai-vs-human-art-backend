const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const artModel = require("../models/artModel");
const multer = require("multer");
const storage = multer.memoryStorage(); // store image in memory
const upload = multer({ storage: storage });
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

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
    res.status(500).json({ error: "Internal server error" });
  }
}
async function uploadImage(req, res) {
  const { type } = req.body;

  if (!type) {
    return res.status(422).json({ message: "Invalid fields" });
  }
  let folderName;
  switch (type) {
    case "ai":
      folderName = "ai-art";
      break;
    case "product":
      folderName = "human-art";
      break;
    /*     default:
      folderName = 'uploads';   -- folderName is mandatory*/
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderName,
    });
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading image to Cloudinary" });
  }
}
module.exports = { displayGallery, uploadImage };
