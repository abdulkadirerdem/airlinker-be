const { getSessionToken } = require("../helpers");
const { WorkspaceModel } = require("../models/workspace");
const { getUserBySessionToken } = require("../services/user-services");

// Workspace oluşturma
const createWorkspace = async (req, res) => {
  const sessionToken = getSessionToken(req);
  const user = await getUserBySessionToken(sessionToken);

  console.log("Userr: ", user);
  if (!user && user?.length > 0) {
    res.status(400).json({ error: error.message });
  }

  try {
    const workspace = new WorkspaceModel({
      ...req.body,
      user: user[0]._id, // Kullanıcının ID'sini workspace'e ekleyin
    });
    await workspace.save();
    res.status(201).json(workspace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Kullanıcının workspace'lerini getirme
const getWorkspaces = async (req, res) => {
  const sessionToken = getSessionToken(req);
  const user = await getUserBySessionToken(sessionToken);

  if (!user || user?.length === 0) {
    res.status(400).json({ error: error.message });
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
