const { getSessionToken } = require("../helpers");
const { WorkspaceModel } = require("../models/workspace");
const { getUserBySessionToken } = require("../services/user-services");

const createWorkspace = async (req, res) => {
  const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
  const user = await getUserById(decoded.id);

  if (!user && user?.length > 0) {
    res.status(400).json({ error: error.message });
  }

  try {
    const workspace = new WorkspaceModel({
      ...req.body,
      user: user[0]._id,
    });
    await workspace.save();
    res.status(201).json(workspace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getWorkspaces = async (req, res) => {
  const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
  const user = await getUserById(decoded.id);

  if (!user || user?.length === 0) {
    res.status(400).json({ error: "User not found!" });
  }

  try {
    const workspaces = await WorkspaceModel.find({
      user: user[0]._id,
    }).populate("airlinks");
    res.status(200).json(workspaces);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createWorkspace, getWorkspaces };
