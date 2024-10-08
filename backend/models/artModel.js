const mongoose = require("mongoose");

const artSchema = new mongoose.Schema({
  src: { type: String, required: true },
  ai: { type: Boolean, required: true },
  name: { type: String, required: false },
});
const mevn_gallery = mongoose.connection.useDb("mevn_gallery");
module.exports = mevn_gallery.model("art", artSchema);

// https://stackoverflow.com/questions/7230953/what-are-mongoose-nodejs-pluralization-rules
