const express = require("express");
const router = express.Router();
const authentication = require("./authentication");
const users = require("./users");
const products = require("./products");
const workspaces = require("./workspaces");
const airlinks = require("./airlinks");
const forms = require("./forms");

module.exports = () => {
  authentication(router);
  users(router);
  products(router);
  workspaces(router);
  airlinks(router);
  forms(router);
  return router;
};
