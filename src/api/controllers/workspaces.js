const { WorkspaceModel } = require("../models/workspace");
const jwt = require("jsonwebtoken");
const {
  getUserById,
  getUserByWalletAddress,
} = require("../services/user-services");

const createWorkspace = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ message: "No token provided!" });
  }

  const jwtToken = authHeader.split(" ")[1];
  const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

  let user;

  if (decoded.publicKey && decoded.publicKey.length > 0) {
    user = await getUserByWalletAddress(decoded.publicKey);
  } else {
    user = await getUserById(decoded.id);
  }

  if (!user && user?.length > 0) {
    res.status(400).json({ error: error.message });
  }

  try {
    const workspace = new WorkspaceModel({
      ...req.body,
      user: user._id,
    });
    await workspace.save();
    res.status(201).json(workspace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getWorkspaces = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ message: "No token provided!" });
  }

  const jwtToken = authHeader.split(" ")[1];
  const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
  let user;

  if (decoded.publicKey && decoded.publicKey.length > 0) {
    user = await getUserByWalletAddress(decoded.publicKey);
  } else {
    user = await getUserById(decoded.id);
  }

  if (!user || user?.length === 0) {
    return res.status(400).json({ error: "User not found!" }); // Added return
  }

  try {
    const workspaces = await WorkspaceModel.find({
      user: user._id,
    }).populate("airlinks");
    return res.status(200).json(workspaces); // Added return
  } catch (error) {
    return res.status(400).json({ error: error.message }); // Added return
  }
};

module.exports = { createWorkspace, getWorkspaces };
