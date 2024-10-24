const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate: [
        (val) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val),
      ],
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // enum = role limiter
      default: "user",
    },
    profile_picture: {
      type: String,
      default:
        "https://res.cloudinary.com/dbrjbu4kt/image/upload/v1729521317/human-art/gllhjacrwvj9zfftk08d.jpg",
    },
    refresh_token: String,
  },
  {
    virtuals: {
      // things not stored in mongodb
      id: {
        get() {
          return this._id; // being a virtual might be wonky with this code
        },
      },
    },
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
const mevn_auth = mongoose.connection.useDb("mevn_auth");
module.exports = mevn_auth.model("User", UserSchema);
