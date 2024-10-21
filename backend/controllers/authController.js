const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
async function register(req, res) {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(422).json({ message: "Invalid fields" });
  }

  const userExists = await User.exists({ email }).exec(); // note -- exec before create, checks if user exists

  if (userExists) return res.sendStatus(409);
  if (role && role !== "admin") {
    return res.status(422).json({ message: "Invalid role" });
  }
  try {
    hashedPassword = await bcrypt.hash(password, 10);

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

  const user = await User.findOne({ email }).exec();

  if (!user)
    return res
      .status(404)
      .json({ message: "Account not found. Try registering." });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(401).json({ message: "Invalid Credentials" });

  const accessToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1800s",
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
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
  res.json({ access_token: accessToken });
}

async function logout(req, res) {
  const cookies = req.cookies;
  const refreshToken = cookies.refresh_token;
  if (!refreshToken) return res.sendStatus(204); // if there is no refresh token, respond wiht nothing

  const user = await User.findOne({ refresh_token: refreshToken }).exec(); // look for user based on refresh token

  if (!user) {
    res.clearCookie("refresh_token", {
      // clears refresh token if user or if not user
      httpOnly: true, // cookie never reaches js
      sameSite: "None", // no public suffix
      secure: true, // encrypted https protocol
    });
    return res.sendStatus(204);
  }

  user.refresh_token = null; // if there is a user with a refresh_token, set it to null. on mongoDB you can see that if a user is logged out their token is set to "null"
  await user.save(); // save user

  res.clearCookie("refresh_token", {
    // save http protocal cookie
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ message: "Successfully logged out" });
}

async function refresh(req, res) {
  const cookies = req.cookies;
  const refreshToken = cookies.refresh_token;
  if (!refreshToken) return res.sendStatus(401);

  const user = await User.findOne({ refresh_token: refreshToken }).exec(); // exec == await with function

  if (!user) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    // creates new access token on basis that refresh token is matched
    if (err || user.id !== decoded.id) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1800s" } // a bit short innit?
    );

    res.json({ access_token: accessToken });
  });
}

async function self(req, res) {
  const user = req.user;

  return res.status(200).json(user);
}

async function user(req, res) {
  const name = req.params["username"];

  return res.status(200);
}
module.exports = { register, login, logout, refresh, self, user };
