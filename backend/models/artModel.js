const mongoose = require("mongoose");

const artSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    ai: { type: Boolean, required: true },
  },
  { collection: "art" }
);
const artModel = mongoose.model("Art", artSchema);
module.exports = artModel;
// https://stackoverflow.com/questions/7230953/what-are-mongoose-nodejs-pluralization-rules
