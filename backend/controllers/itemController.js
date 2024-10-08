const artModel = require("../models/artModel");
const cloudinarySet = require("../config/storage");
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
  let folderName;

  // Determine the folder name based on user input
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

  try {
    const result = await cloudinarySet.cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "Error uploading image", error: error.message });
        }
        return res.status(200).json({
          message: "Image uploaded successfully",
          url: result.secure_url,
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error uploading image", error: error.message });
  }
}
module.exports = { displayGallery, uploadImage };
