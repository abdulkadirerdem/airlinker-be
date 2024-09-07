const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ["radio", "multiple-choice", "text"],
    required: true,
  },
  options: [{ type: String }],
  correctAnswer: { type: mongoose.Schema.Types.Mixed, select: false, required: true },
});

const ResponseSchema = new mongoose.Schema({
  answers: [{ type: mongoose.Schema.Types.Mixed, default: [] }],
});

const QuizSchema = new mongoose.Schema(
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

const QuizModel = mongoose.model("Quiz", QuizSchema);

module.exports = { QuizModel };
