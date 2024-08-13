const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  airlinks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Airlink" }],
});

const WorkspaceModel = mongoose.model("Workspace", WorkspaceSchema);

module.exports = { WorkspaceModel };
