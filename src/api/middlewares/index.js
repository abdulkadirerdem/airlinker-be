const { get, merge } = require("lodash");
const { getUserById, getUserByWalletAddress } = require("../services/user-services");
const jwt = require("jsonwebtoken");

const isOwner = (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id");

    if (!currentUserId) {
      res
        .status(403)
        .json({ message: "There is no such user ID in the session!" });
      return;
    }

    if (currentUserId.toString() !== id) {
      res.status(403).json({
        message: "The authenticated user does not own this resource!",
      });
      return;
    }

    next();
  } catch (error) {
    console.log("Error from isOwner: ", error);
    res.status(400).json({ message: "Error while verifying ownership!" });
  }
};

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const jwtToken = authHeader && authHeader.split(" ")[1]; // Bearer token ayrıştırması

    if (!jwtToken) {
      res.status(403).json({ message: "No session token provided!" });
      return;
    }

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    let existingUser;
    if (decoded.publicKey && decoded.publicKey.length > 0) {
      existingUser = await getUserByWalletAddress(decoded.publicKey);
    } else {
      existingUser = await getUserById(decoded.id);
    }

    if (!existingUser) {
      res.status(403).json({ message: "User not found!" });
      return;
    }

    // `merge` yerine doğrudan atama
    req.identity = existingUser[0];

    return next();
  } catch (error) {
    console.error("Error from isAuthenticated: ", error);
    res.status(400).json({ message: "Authentication error!" });
  }
};

module.exports = {
  isAuthenticated,
  isOwner,
};
