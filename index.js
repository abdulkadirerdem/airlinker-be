const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./src/api/routes");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:8083",
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on ", process.env.PORT || 3000);
});

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("error", (error) => console.log(error));

app.use("/", router());
