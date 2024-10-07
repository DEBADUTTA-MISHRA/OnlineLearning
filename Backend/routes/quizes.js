const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const quizController = require('../controllers/quizController');
const quizValidator = require('../validators/quizValidator');


router.post('/addQuiz/:courseId/:lessonId', authMiddleware.verifyToken, quizController.addQuizToLesson);

router.post('/submit/:courseId/:quizId', authMiddleware.verifyToken, quizController.submitQuiz);

router.get('/results/:quizId', authMiddleware.verifyToken, quizController.getQuizResults);

module.exports = router;