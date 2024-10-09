const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const storage = multer.memoryStorage();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = multer({ storage: storage });
module.exports = { cloudinary, upload };
