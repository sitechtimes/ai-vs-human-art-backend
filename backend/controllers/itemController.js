const artModel = require("../models/artModel");
const cloudConfig = require("../config/storage");
const User = require("../models/user");
let artDict = [];
const fetchArtData = async () => {
  // separate function for safety purposes
  try {
    artDict = await artModel.find().lean(); // lean ignores hydrating. could include exec if necessary to self Await
    // what if.. instead of .lean().. it was called.. .fe!n()... hahahahaha
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
async function uploadProfilePicture(req, res) {
  try {
    cloudConfig.cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: "profile-pictures",
          transformation: [
            {
              width: 800,
              height: 800,
              crop: "limit",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },
        async (error, result) => {
          const userID = req.user._id; // takes users own ID from middleware
          const updatedUser = await User.findByIdAndUpdate(
            userID,
            { profile_picture: result.secure_url },
            { new: true } // returns new user
          );
          res.json({ url: result.secure_url });
          if (error) {
            return res
              .status(500)
              .json({ error: "Upload failed", details: error });
          }
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
  const type = req.query.type; // this is based on query instead of a paramter. prioritzed over req.body or req.params

  const fulldata = req.query.fulldata;
  const pleaseReturnFullData = fulldata === "true";

  const folderName = new Set(["ai", "human"]).has(type) ? type + "-art" : "";

  try {
    const result = await cloudConfig.cloudinary.api.resources({
      // cloudinary search? Nah
      type: "upload",
      prefix: folderName,
      context: true,
    });
    //const folders = await cloudConfig.cloudinary.api.root_folders();
    const urls = result.resources.map((resource) => resource.secure_url);
    res.json([pleaseReturnFullData ? result : urls, folderName]); // ternary operator is lit.. condition ? true : false
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ message: "Failed to retrieve assets" });
  }
}

async function grabRandomImage(req, res) {
  const type = req.query.type; // this is based on query instead of a paramter. prioritzed over req.body or req.params

  if (!type) {
    return res.status(400).json({ message: "no type provided" });
  }

  const folderName = new Set(["ai", "human"]).has(type) ? type + "-art" : false;
  if (!folderName) return res.status(400).json({ message: "Invalid type" });

  try {
    const result = await cloudConfig.cloudinary.api.resources({
      type: "upload",
      prefix: folderName,
      context: true,
    });
    const resources = result.resources;
    let randomImage = resources[Math.floor(Math.random() * resources.length)];
    res.json(randomImage); // ternary operator is lit
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ message: "Failed to retrieve assets" });
  }
}
async function grabImageByTag(req, res) {
  const tag = req.params.tag;
  const type = req.query.type; // this is based on query instead of a paramter. prioritzed over req.body or req.params
  if (!type) {
    return res.status(400).json({ message: "no type provided" });
  }

  const folderName = new Set(["ai", "human"]).has(type) ? type + "-art" : false;
  if (!folderName) return res.status(400).json({ message: "Invalid type" });

  try {
    /* const result = cloudConfig.cloudinary.url(`${tag}.json`, { type: "list" }); */
    cloudConfig.cloudinary.api
      .resources_by_tag(`${tag}`)
      .then((result) =>
        res.json(result.resources.map((resource) => resource.secure_url))
      );
    /* cloudConfig.cloudinary.api.tags().then((result) => console.log(result)); */
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ message: "Failed to retrieve assets" });
  }
}

async function uploadManyImages(req, res) {
  const { tag, type, name } = req.body;
  if (!type) {
    return res.status(422).json({ message: "Invalid fields" });
  }
  const folderName = new Set(["ai", "human", "unscreened"]).has(type)
    ? type + "-art"
    : false;
  if (!folderName) return res.status(400).json({ message: "Invalid type" });

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageDict = [];
  await Promise.all(
    req.files.map(
      (file, index) =>
        new Promise((resolve, reject) => {
          cloudConfig.cloudinary.uploader
            .upload_stream(
              {
                resource_type: "auto",
                folder: folderName,
                tags: [tag[index]],
                context: `artist_name=${name[index]}`,
                use_asset_folder_as_public_id_prefix: true,
                transformation: [
                  {
                    width: 800,
                    height: 800,
                    crop: "limit",
                    quality: "auto",
                    fetch_format: "auto",
                  },
                ],
              },
              (error, result) => {
                if (error) return reject(error);

                imageDict.push(result.secure_url);
                resolve();
              }
            )
            .end(file.buffer);
        })
    )
  )
    .then(() => {
      // there are no errors in ba sing se
      res.json({ imageDict: imageDict });
    })
    .catch((error) => {
      // there are errors in ba sing se
      return res
        .status(500)
        .json({ message: "Error uploading image", error: error.message });
    });
}

/* async function uploadImage(req, res) {
  const { link, type } = req.body;

  const folderName = new Set(["ai", "human"]).has(type) ? type + "-art" : false;
  if (!folderName) return res.status(400).json({ message: "Invalid type" });

  if (!type) {
    return res.status(422).json({ message: "Invalid fields" });
  }
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    cloudConfig.cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: folderName,
          tags: link,
          transformation: [
            {
              width: 800,
              height: 800,
              crop: "limit",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },
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
} */
module.exports = {
  displayGallery,
  grabImages,
  grabRandomImage,
  uploadProfilePicture,
  uploadManyImages,
  grabImageByTag,
};
