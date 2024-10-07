const Joi = require('joi');

// Schema for uploading learning material
const uploadLearningMaterialSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  courseId: Joi.string().alphanum().required(),
  contentType: Joi.string().valid('video', 'pdf', 'slideshow').required(),
  fileUrl: Joi.string().uri().required(),
});

const validateUploadLearningMaterial = (req, res, next) => {
  const { error } = uploadLearningMaterialSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validateUploadLearningMaterial };
