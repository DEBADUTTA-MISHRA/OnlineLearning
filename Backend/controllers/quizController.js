const quizService = require('../services/quizService');
const responseHelper = require('../helpers/responseHelper');
const Progress = require('../models/progress');

// const createQuiz = async (req, res) => {
//   try {
//     const quizData = req.body;

//     await quizService.createQuiz(quizData);
//     responseHelper.successResponse(res, 'Quiz created successfully');
//   } catch (error) {
//     console.error(error.message);
//     responseHelper.errorResponse(res, 'Server error');
//   }
// };


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


    // Update the progress for the user directly
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
    console.log("answers",answers);
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