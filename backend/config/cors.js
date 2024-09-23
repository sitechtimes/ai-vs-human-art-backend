const allowedOrigins = require("./allowed_origins.js");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("You are not allowed to access this by CORS"));
    }
  },
};
// Checks if origin matches allowed origin
module.exports = { corsOptions };
