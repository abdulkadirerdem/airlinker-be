const { get, merge } = require("lodash");
const { getUserBySessionToken } = require("../services/user-services");

const isOwner = (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id");

    if (!currentUserId) {
      res.statusMessage = "There is no such an id.!";
      return res.sendStatus(403);
    }

    if (currentUserId.toString() !== id) {
      res.statusMessage = "This user is not current user!";
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log("Error from is owner: ", error);

    res.statusMessage = "Error while finding user is owner or not!";
    return res.sendStatus(400);
  }
};

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const sessionToken = authHeader && authHeader.split(" ")[1]; // Extract token from Bearer scheme

    if (!sessionToken) {
      res.statusMessage = "There is no session token!";
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(
      sessionToken,
      "+authentication.sessionToken"
    );

    if (!existingUser) {
      res.statusMessage = "There is no user!";
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser[0] });

    return next();
  } catch (error) {
    console.error("Error from Is Authenticated: ", error);
    res.statusMessage = "Error from is authenticated!";
    return res.sendStatus(400);
  }
};

module.exports = {
  isAuthenticated,
  isOwner,
};
