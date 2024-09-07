const mongoose = require("mongoose");

const AirlinkSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["form", "game", "quiz", "raffle"],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    form: { type: mongoose.Schema.Types.ObjectId, ref: "Form" },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
  },
  { timestamps: true }
);

const AirlinkModel = mongoose.model("Airlink", AirlinkSchema);

module.exports = { AirlinkModel };
