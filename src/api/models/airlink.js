const mongoose = require("mongoose");

const AirlinkSchema = new mongoose.Schema({
  type: { type: String, enum: ["form", "game"], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  form: { type: mongoose.Schema.Types.ObjectId, ref: "Form" },
});

const AirlinkModel = mongoose.model("Airlink", AirlinkSchema);

module.exports = { AirlinkModel };
