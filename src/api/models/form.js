const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ["radio", "multiple-choice", "text", "connect-wallet"],
    required: true,
  },
  options: [{ type: String }],
});

const ResponseSchema = new mongoose.Schema({
  answers: [{ type: mongoose.Schema.Types.Mixed, default: [] }],
});

const FormSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: [QuestionSchema],
    responses: [ResponseSchema],
    airlink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Airlink",
      required: true,
    },
  },
  { timestamps: true }
);

const FormModel = mongoose.model("Form", FormSchema);

module.exports = { FormModel };
