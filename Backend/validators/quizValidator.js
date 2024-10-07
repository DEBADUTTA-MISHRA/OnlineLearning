const Joi = require('joi');

// Schema for creating a quiz
const createQuizSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().optional(),
  questions: Joi.array().items(Joi.object({
    question: Joi.string().required(),
    options: Joi.array().items(Joi.string()).required(),
    correctAnswer: Joi.string().required(),
  })).min(1).required(),
});

const validateCreateQuiz = (req, res, next) => {
  const { error } = createQuizSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validateCreateQuiz };
