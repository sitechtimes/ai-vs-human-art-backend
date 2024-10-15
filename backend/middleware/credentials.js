// clientside credential checking
const allowedOrigins = require("../config/allowed_origins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    // allows allowed servers
    res.header("Access-Control-Allow-Origin", origin); // gives it a cool header
    res.header("Access-Control-Allow-Credentials", true);
  }

  next();
};

module.exports = credentials;
