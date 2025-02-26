const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  right: {
    type: Number,
  },
  total: {
    type: Number,
  },
  time: {
    type: Date,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Game", gameSchema);
