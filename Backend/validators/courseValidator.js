const Joi = require('joi');

// Create Course Validator
const create = (req, res, next) => {
  // Define Joi schema for creating a course
  const schema = Joi.object({
    title: Joi.string().min(1).required().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title cannot be empty',
    }),
    description: Joi.string().min(1).required().messages({
      'any.required': 'Description is required',
      'string.empty': 'Description cannot be empty',
    }),
    category: Joi.string().min(1).required().messages({
      'any.required': 'Category is required',
      'string.empty': 'Category cannot be empty',
    }),
    tags: Joi.array().items(Joi.string()).optional(),
  });

  // Validate request body
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => ({ message: detail.message, path: detail.path[0] }));
    return res.status(400).json({ errors });
  }

  next();
};

// Update Course Validator
const update = (req, res, next) => {
  // Define Joi schema for updating a course
  const schema = Joi.object({
    title: Joi.string().min(1).optional().messages({
      'string.empty': 'Title cannot be empty',
    }),
    description: Joi.string().min(1).optional().messages({
      'string.empty': 'Description cannot be empty',
    }),
  });

  // Validate request body
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => ({ message: detail.message, path: detail.path[0] }));
    return res.status(400).json({ errors });
  }

  next();
};

// Validate Course ID in params
const validateId = (req, res, next) => {
  // Define Joi schema for validating id parameter
  const schema = Joi.object({
    id: Joi.string().required().messages({
      'any.required': 'Course ID is required',
      'string.empty': 'Course ID cannot be empty',
    }),
  });

  // Validate request params
  const { error } = schema.validate(req.params, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => ({ message: detail.message, path: detail.path[0] }));
    return res.status(400).json({ errors });
  }

  next();
};

// Schema for enrolling in a course
const enrollInCourseSchema = Joi.object({
  courseId: Joi.string().alphanum().required(),
});

const validateEnrollInCourse = (req, res, next) => {
  const { error } = enrollInCourseSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { create, update, validateId, enrollInCourseSchema, validateEnrollInCourse };
