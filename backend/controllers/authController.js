const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

async function register(req, res) {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(422).json({ message: "Invalid fields" });
  }

  const userExists = await User.exists({ email }); // note -- exec before create, checks if user exists -- but im already calling async here

  if (userExists)
    return res
      .status(409)
      .json({ message: "This email is already being used by an account" });
  if (role && role !== "admin") {
    return res.status(422).json({ message: "Invalid role" });
  }
  if (username.length < 4) {
    return res
      .status(422)
      .json({ message: "Usernames should be 4 characters or longer" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserRole = role === "admin" ? "admin" : "user"; // assignemnt === condition ? true : false

    await User.create({
      email,
      username,
      password: hashedPassword,
      role: newUserRole,
    });

    return res.sendStatus(201);
  } catch (error) {
    return res.status(400).json({ message: "Could not register" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(422)
      .json({ message: "Invalid fields. Email and Password are Required" });

  const user = await User.findOne({ email });

  if (!user)
    return res
      .status(404)
      .json({ message: "Account not found. Try registering." });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(401).json({ message: "Invalid Credentials" });

  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      userid: user.userid,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1800s",
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      userid: user.userid,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  user.refresh_token = refreshToken; // sets user refresh token to refresh token to be compared to later
  await user.save(); // saves user

  res.cookie("refresh_token", refreshToken, {
    // sets response cookie refrsh_token to the signed refresh token created
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  {
    res.json({
      access_token: accessToken,
      user,
    });
  }
}

async function logout(req, res) {
  const cookies = req.cookies;
  const refreshToken = cookies.refresh_token;
  if (!refreshToken) return res.sendStatus(204); // if there is no refresh token, respond wiht nothing
  const user = await User.findOne({ refresh_token: refreshToken }); // look for user based on refresh token

  if (user) {
    user.refresh_token = null; // if there is a user with a refresh_token, set it to null. on mongoDB you can see that if a user is logged out their token is set to "null"
    await user.save(); // save user
  }

  res.clearCookie("refresh_token", {
    // clears refresh token if user or if not user, save http protocols
    httpOnly: true, // cookie never reaches js
    sameSite: "None", // no public suffix
    secure: true, // encrypted https protocol
  });

  console.log("User logged out, refresh token cleared");
  res.status(200).json({ message: "Successfully logged out" });
}

async function refresh(req, res) {
  const cookies = req.cookies;
  const refreshToken = cookies.refresh_token;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    // creates new access token on basis that refresh token is matched

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1800s" } // a bit short innit?
    );
    res.json({ accessToken });
  });
}

async function validateToken(req, res) {
  const { accessToken } = req.body;
  if (!accessToken) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      const user = await User.findById(decoded.id);
      if (err || user.id !== decoded.id)
        return res.status(403).json({ message: "Invalid token user mismatch" });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user });
    }
  );
}
async function cookiePing(req, res) {
  const hasRefreshToken = !!req.cookies?.refresh_token;
  res.json({ authenticated: hasRefreshToken });
}
async function self(req, res) {
  const user = req.user;

  return res.status(200).json(user);
}

async function user(req, res) {
  const findThisUser = req.params.userid;
  if (!findThisUser) {
    return res.status(422).json({ message: "Please provide an ID" });
  }
  try {
    const user = await User.findOne(
      { userid: findThisUser },
      { username: 1, profile_picture: 1, userid: 1 }
    );
    if (!user) {
      return res.status(404).json({ message: "No user found." });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function highScoreUpdate(req, res) {
  const { newHighScore, userId } = req.body;
  if (!newHighScore || !userId) {
    return res.status(422).json({ message: "Missing field." });
  }
  try {
    const user = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(`${userId}`) },
      { highScore: newHighScore },
      { new: true }
    );
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user corresponds to sent id." });
    }
    return res
      .status(200)
      .json({ message: "High score updated successfully.", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating high score", error: error.message });
  }
}

module.exports = {
  register,
  login,
  logout,
  refresh,
  self,
  user,
  highScoreUpdate,
};
module.exports = {
  register,
  login,
  logout,
  refresh,
  self,
  user,
  validateToken,
  cookiePing,
};
