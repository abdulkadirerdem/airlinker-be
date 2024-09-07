const { QuizModel } = require("../models/quiz");

// Yeni quiz oluştur
const createQuiz = async (quizData) => {
  const { title, description, questions, airlink } = quizData;
  const quiz = new QuizModel({ title, description, questions, airlink });
  await quiz.save();
  return quiz;
};

// Quizleri getir
const getQuizzes = async () => {
  return await QuizModel.find();
};

// Belirli bir quiz getir
const getQuizById = async (id) => {
  return await QuizModel.findById(id);
};

// Quiz güncelle
const updateQuiz = async (id, quizData) => {
  return await QuizModel.findByIdAndUpdate(id, quizData, { new: true });
};

// Quiz sil
const deleteQuiz = async (id) => {
  return await QuizModel.findByIdAndDelete(id);
};

const submitQuizResponse = async (quizId, answers) => {
  const quiz = await QuizModel.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");

  quiz.responses.push(answers);
  await quiz.save();
  return quiz;
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitQuizResponse,
};
