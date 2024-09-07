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
      workspace: workspaceId,
    });

    await airlink.save();

    workspace.airlinks.push(airlink._id);
    await workspace.save();

    res.status(201).json(airlink);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAirlinks = async (req, res) => {
  try {
    const airlinks = await AirlinkModel.find()
      .populate("form")
      .populate("quiz");

    res.status(200).json(airlinks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAirlinksByWorkstation = async (req, res) => {
  const { id } = req.params;

  try {
    const airlinks = await AirlinkModel.find({ workspace: id })
      .populate("form")
      .populate("quiz");

    res.status(200).json(airlinks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createAirlink, getAirlinks, getAirlinksByWorkstation };
