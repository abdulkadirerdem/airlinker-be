const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./src/api/routes");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();
require("./src/auth/passport");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:8083",
      "https://airlinker.vercel.app/",
      "https://airlinker.vercel.app",
    ],
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on ", process.env.PORT || 3000);
});

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("error", (error) => console.log(error));

app.use("/", router());
