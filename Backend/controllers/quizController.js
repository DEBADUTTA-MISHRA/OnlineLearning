const quizService = require('../services/quizService');
const responseHelper = require('../helpers/responseHelper');
const Progress = require('../models/progress');


const addQuizToLesson = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const { courseId, lessonId } = req.params;
    const userId = req.user.id;

    const quizData = {
      title,
      questions,
    };

    await quizService.addQuizToLesson(courseId, lessonId, quizData);


    await Progress.findOneAndUpdate(
      { user: userId, course: courseId },
      { $inc: { totalQuizzes: 1 }, lastUpdated: Date.now() },
      { new: true, upsert: true }
    );


    responseHelper.successResponse(res, 'Quiz added successfully');
  } catch (error) {
    console.error(error.message);
    responseHelper.errorResponse(res, 'Server error');
  }
};


const submitQuiz = async (req, res) => {
  try {
    const { courseId, quizId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id; 


    const result = await quizService.submitQuiz(courseId, quizId, answers, userId);

    responseHelper.successResponse(res, "Quiz submitted successfully", result);
  } catch (error) {
    console.error(error.message);
    responseHelper.errorResponse(res, "Server error");
  }
};


const getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;

    const result = await quizService.getQuizResults(quizId);

    responseHelper.successResponse(res, "Quiz results fetched successfully", result);
  } catch (error) {
    console.error(error.message);
    responseHelper.errorResponse(res, "Server error");
  }
};


module.exports = {
  addQuizToLesson,
    submitQuiz,
    getQuizResults
}