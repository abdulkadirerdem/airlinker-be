const { AirlinkModel } = require("../models/airlink");
const { WorkspaceModel } = require("../models/workspace");

const createAirlink = async (req, res) => {
  try {
    const { workspace: workspaceId } = req.body;

    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const airlink = new AirlinkModel({
      ...req.body,
      workspace: workspaceId, // Workspace'e bağlıyoruz
    });

    await airlink.save();

    // Workspace'e airlink'i ekleyelim
    workspace.airlinks.push(airlink._id);
    await workspace.save();

    res.status(201).json(airlink);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAirlinks = async (req, res) => {
  try {
    const airlinks = await AirlinkModel.find().populate("form");
    res.status(200).json(airlinks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createAirlink, getAirlinks };
