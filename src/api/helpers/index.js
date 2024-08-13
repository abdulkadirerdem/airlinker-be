const crypto = require("crypto");

const random = () => crypto.randomBytes(128).toString("base64");
const authentication = (salt, password) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(process.env.SECRET)
    .digest("hex");
};

const getSessionToken = (req) => {
  let sessionToken;
  if (process.env.NODE_ENV === "production") {
    const authHeader = req.headers["authorization"];
    sessionToken = authHeader && authHeader.split(" ")[1];
  } else {
    sessionToken = req.cookies["COOKIE-KEY"];
  }

  return sessionToken;
};

module.exports = {
  random,
  authentication,
  getSessionToken,
};
