const learningService = require('../services/meterialService');
const responseHelper = require('../helpers/responseHelper');
const Progress = require('../models/progress');



const uploadLearningMaterial = async (req, res) => {
  try {
    const { title, description, duration } = req.body;
    const { courseId, lessonId } = req.params;
    const userId = req.user.id;
    const videoUrl = req.file ? `/uploads/videos/${req.file.filename}` : null;

    const materialData = {
      type: 'video',
      url: videoUrl,
      title,
      description,
      duration,
    };

    await learningService.uploadLearningMaterial(courseId, lessonId, materialData);

    await Progress.findOneAndUpdate(
      { user: userId, course: courseId },
      { $inc: { totalMaterials: 1 }, lastUpdated: Date.now() },
      { new: true, upsert: true }
    );

    responseHelper.successResponse(res, 'Learning material uploaded successfully');
  } catch (error) {
    console.error(error.message);
    responseHelper.errorResponse(res, 'Server error');
  }
};


const getLearningMaterial = async (req,res) => {
try{
  const {courseId,lessonId, materialId}= req.params
  const materials = await learningService.getLearningMaterial(courseId,lessonId, materialId);
  responseHelper.successResponse(res, 'Course retrieved successfully', materials);
}
catch(error){
  console.error(error.message);
  responseHelper.errorResponse(res, 'Server error');
}
}


const deleteLearningMaterial = async (req, res) => {
  try {
    const { courseId,lessonId, materialId } = req.params;
    await learningService.deleteLearningMaterial(courseId,lessonId, materialId);
    responseHelper.successResponse(res, 'Learning material deleted successfully');
  } catch (error) {
    console.error(error.message);
    responseHelper.errorResponse(res, 'Server error');
  }
};


  module.exports = {
    uploadLearningMaterial,
    deleteLearningMaterial,
    getLearningMaterial
  }