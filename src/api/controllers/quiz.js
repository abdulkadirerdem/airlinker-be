const quizService = require("../services/quiz-services");
const { AirlinkModel } = require("../models/airlink");

// Yeni quiz oluştur
const createQuiz = async (req, res) => {
  try {
    const { airlink: airlinkId } = req.body;

    const airlink = await AirlinkModel.findById(airlinkId);

    if (!airlink) {
      return res.status(404).json({ message: "Airlink not found" });
    }

    if (
      airlink.form === null ||
      airlink.quiz === null ||
      airlink.raffle === null
    ) {
      return res.status(400).json({
        message: "This Airlink already has a form or quiz or raffle.",
      });
    }

    const quiz = await quizService.createQuiz(req.body);

    airlink.quiz = quiz._id;
    await airlink.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Quizleri getir
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await quizService.getQuizzes();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Belirli bir quiz getir
const getQuizById = async (req, res) => {
  try {
    const quiz = await quizService.getQuizById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Quiz güncelle
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuiz = await quizService.updateQuiz(id, req.body);
    if (!updatedQuiz) return res.status(404).json({ error: "Quiz not found" });
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Quiz sil
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await quizService.deleteQuiz(id);
    if (!deletedQuiz) return res.status(404).json({ error: "Quiz not found" });
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitQuizResponse = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    const responseArr = [];

    for (const [key, value] of Object.entries(answers)) {
      responseArr.push({ questionId: key, answer: value });
    }

    const reponseModel = { answers: responseArr };

    const updatedQuiz = await quizService.submitQuizResponse(
      quizId,
      reponseModel
    );

    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitQuizResponse,
};
