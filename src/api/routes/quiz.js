const {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitQuizResponse,
} = require("../controllers/quiz");

module.exports = (router) => {
  router.post("/quizzes", createQuiz);
  router.get("/quizzes", getQuizzes);
  router.get("/quizzes/:id", getQuizById);
  router.put("/quizzes/:id", updateQuiz);
  router.delete("/quizzes/:id", deleteQuiz);
  router.post("/quizzes/:quizId/submit", submitQuizResponse);
};
