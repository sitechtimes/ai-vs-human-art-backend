const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  right: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Game", gameSchema);
