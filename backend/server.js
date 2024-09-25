require("dotenv").config();
const express = require("express");
const app = express();
const ports = process.env.PORT || 3000;
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./middleware/error_handler");
const path = require("path");
const corsOptions = require("./config/cors");
const credentials = require("./middleware/credentials");
const connectDB = require("./config/database");
const jwt = require("./middleware/jwtAuth");
const routeMiddleware = require("./routes/api/auth");
/* cors, cookieparser, other imports */
connectDB();
app.use(jwt);
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(credentials);
app.use(express.json());
app.use(cookieParser()); // cookie middleware
app.use(errorHandler); // error handler (very basic)
app.use(routeMiddleware);
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.all("*", (req, res) => {
  res.status(404);
  // default false endpoint rerouter
  if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("text").send("404 Not Found");
  }
});
mongoose
  .connect(process.env.DATABASE_URI, {
    dbName: "mevn_gallery",
  })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
  });
mongoose.connection.on(
  // only opens database once connection is secure
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
mongoose.connection.once("open", () => {
  console.log("Mongoose is connected");
  app.listen(ports, () => {
    console.log(`App is listening at http://localhost:${ports}`);
    console.log("server.js.53", Object.keys(mongoose.connection.collections));
  });
});
