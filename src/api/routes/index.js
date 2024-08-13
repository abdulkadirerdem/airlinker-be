const express = require("express");
const router = express.Router();
const authentication = require("./authentication");
const users = require("./users");
const products = require("./products");

module.exports = () => {
  authentication(router);
  users(router);
  products(router);
  return router;
};
