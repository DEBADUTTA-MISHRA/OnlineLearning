const Joi = require('joi');

const register = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(1).required().messages({
      'any.required': 'Name is required',
      'string.empty': 'Name cannot be empty',
    }),
    email: Joi.string().email().required().messages({
      'any.required': 'Please include a valid email',
      'string.email': 'Please include a valid email',
    }),
    password: Joi.string().min(6).when(Joi.object({ socialId: Joi.exist() }).unknown(), {
      then: Joi.forbidden(),
      otherwise: Joi.required(),
    }).messages({
      'any.required': 'Password must be 6 or more characters',
      'string.min': 'Password must be at least 6 characters',
    }),
    socialId: Joi.string().allow(null, ''),
    profilePicture: Joi.string().uri().optional().messages({
      'string.uri': 'Profile picture must be a valid URL',
    }),
    bio: Joi.string().optional().allow(''),
    role: Joi.string().valid('student', 'instructor', 'admin').default('student').optional().messages({
      'any.only': 'Role must be one of the following: student, instructor, admin',
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => ({ message: detail.message, path: detail.path[0] }));
    return res.status(400).json({ errors });
  }

  next();
};


const login = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'any.required': 'Please include a valid email',
      'string.email': 'Please include a valid email',
    }),
    password: Joi.string().min(1).messages({
      'any.required': 'Password is required',
      'string.empty': 'Password is required',
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => ({ message: detail.message, path: detail.path[0] }));
    return res.status(400).json({ errors });
  }

  next();
};

const updateUserProfileSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50),
});

const validateUpdateUserProfile = (req, res, next) => {
  const { error } = updateUserProfileSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { register, login, updateUserProfileSchema, validateUpdateUserProfile };
