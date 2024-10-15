const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function adminMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" }); // requires a token with the header
  }

  const token = authHeader.split(" ")[1]; // splits just token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    // verifies it with secret cool epic access_token
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    const user = await User.findById(decoded.id); // jwt decoded id matched with user
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // if no user
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have permission" }); // if 403, role no match
    }

    req.user = user; // sets user ti the request user
    next(); // continues to next middleware
  });
}

module.exports = adminMiddleware;
