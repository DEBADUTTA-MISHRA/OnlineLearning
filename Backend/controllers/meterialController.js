const learningService = require('../services/meterialService');
const responseHelper = require('../helpers/responseHelper');



// const uploadLearningMaterial = async (req, res) => {
//   try {
//     const { type, url, title, description, duration } = req.body;
//     const { courseId, lessonId } = req.params;

//     const materialData = {
//       type,
//       url,
//       title,
//       description,
//       duration,
//     };

//     await learningService.uploadLearningMaterial(courseId, lessonId, materialData);
//     responseHelper.successResponse(res, 'Learning material uploaded successfully');
//   } catch (error) {
//     console.error(error.message);
//     responseHelper.errorResponse(res, 'Server error');
//   }
// };



const uploadLearningMaterial = async (req, res) => {
  try {
    const { title, description, duration } = req.body;
    const { courseId, lessonId } = req.params;
    const videoUrl = req.file ? `/uploads/videos/${req.file.filename}` : null; // Construct the video URL

    const materialData = {
      type: 'video', // Set the type if you want to differentiate between material types
      url: videoUrl,
      title,
      description,
      duration,
    };

    await learningService.uploadLearningMaterial(courseId, lessonId, materialData);
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
    console.log("courseId:-->",courseId,lessonId,materialId);
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