import { v2 as cloudinary } from "cloudinary";

(async function () {
  cloudinary.config({
    cloud_name: "dbrjbu4kt",
    api_key: "392916843562773",
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  uploadResult = (path, folder) => {
    cloudinary.uploader
      .upload(
        "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
        {
          public_id: "shoes",
        }
      )
      .then((data) => {
        return { url: data.url, public_id: data.public_id };
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(uploadResult);

  const optimizeUrl = cloudinary.url("shoes", {
    fetch_format: "auto",
    quality: "auto",
  });

  console.log(optimizeUrl);

  const autoCropUrl = cloudinary.url("shoes", {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  });

  console.log(autoCropUrl);
})();
module.exports = { uploadResult };
