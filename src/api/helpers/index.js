const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const random = () => crypto.randomBytes(128).toString("base64");

const authentication = (salt, password) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(process.env.JWT_SECRET)
    .digest("hex");
};

module.exports = {
  random,
  authentication,
};
