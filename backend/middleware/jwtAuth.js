const jwt = require("jsonwebtoken");
const User = require("../models/user");

function authentication(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization; // checks for caps

  if (authHeader?.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      // checks token with access token
      if (err) {
        req.user = {};
        return next();
      }

      const user = await User.findById(decoded.objectid) // finds user by id, ignore password, await
        .select({ password: 0, refresh_token: 0 });

      if (user) {
        req.user = user.toObject({ getters: true }); // request should contain a user object with virtuals
      } else {
        req.user = {}; // don't return a user
      }

      return next();
    });
  } else {
    req.user = {};
    return next();
  }
}

module.exports = authentication;
