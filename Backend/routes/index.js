const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/courses', require('./courses'));
router.use('/lessons', require('./lessons'));
router.use('/material', require('./meterial'));
router.use('/quizzes',require('./quizes'));

module.exports = router;
