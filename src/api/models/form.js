const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["radio", "select", "dropdown"], required: true },
  options: [{ type: String }], // options boş olabilir
});

const ResponseSchema = new mongoose.Schema({
  answers: [{ type: mongoose.Schema.Types.Mixed }], // Her bir soruya yanıt
});

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  questions: [QuestionSchema],
  responses: [ResponseSchema], // Birden fazla yanıt olabilir
});

const FormModel = mongoose.model("Form", FormSchema);

module.exports = { FormModel };
