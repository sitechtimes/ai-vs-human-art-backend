/* const { router } = require("express");
const app = express();
const artModel = require("../../models/artModel");

app.get("/", async (req, res) => {
  try {
    const artList = await artModel
      .find()
      .lean()
      .exec()
      .then((result) => {
        res.status(200).json(artList);
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
 */
