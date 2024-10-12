const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
async function register(req, res) {
  const { username, email, password, password_confirm, role } = req.body;

  if (!username || !email || !password || !password_confirm) {
    return res.status(422).json({ message: "Invalid fields" });
  }

  if (password !== password_confirm)
    return res.status(422).json({ message: "Passwords do not match" });

  const userExists = await User.exists({ email }).exec(); // exec before create

  if (userExists) return res.sendStatus(409);
  if (role && role !== "admin") {
    return res.status(422).json({ message: "Invalid role" });
  }
  try {
    hashedPassword = await bcrypt.hash(password, 10);

    const newUserRole = role === "admin" ? "admin" : "user";

    await User.create({
      email,
      username,
      password: hashedPassword,
      role: newUserRole, // Use the determined role here
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

  user.refresh_token = refreshToken;
  await user.save();

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ access_token: accessToken });
}

async function logout(req, res) {
  const cookies = req.cookies;

  if (!cookies.refresh_token) return res.sendStatus(204);

  const refreshToken = cookies.refresh_token;
  const user = await User.findOne({ refresh_token: refreshToken }).exec();

  if (!user) {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(204);
  }

  user.refresh_token = null;
  await user.save();

  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ message: "Successfully logged out" });
}

async function refresh(req, res) {
  const cookies = req.cookies;
  if (!cookies.refresh_token) return res.sendStatus(401);

  const refreshToken = cookies.refresh_token;

  const user = await User.findOne({ refresh_token: refreshToken }).exec();

  if (!user) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1800s" } // a bit short innit?
    );

    res.json({ access_token: accessToken });
  });
}

async function user(req, res) {
  const user = req.user;

  return res.status(200).json(user);
}

module.exports = { register, login, logout, refresh, user };
