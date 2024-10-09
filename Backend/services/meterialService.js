const Course = require('../models/course');



const uploadLearningMaterial = async (courseId, lessonId, materialData) => {
  try {
    const { type, url, title, description, duration } = materialData;

    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    lesson.learningMaterials.push({ type, url, title, description, duration });

    await course.save();

    return { message: 'Learning material uploaded successfully' };
  } catch (error) {
    throw new Error(`Failed to upload learning material: ${error.message}`);
  }
};






const getLearningMaterial = async (courseId, lessonId, materialId) => {
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    return lesson.learningMaterials;
  } catch (error) {
    throw new Error(`Failed to get learning material: ${error.message}`);
  }
};



const deleteLearningMaterial = async (courseId, lessonId, materialId) => {
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    lesson.learningMaterials = lesson.learningMaterials.filter(material => !material._id.equals(materialId));

    await course.save();

    return { message: 'Learning material deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete learning material: ${error.message}`);
  }
};


module.exports = { uploadLearningMaterial, getLearningMaterial, deleteLearningMaterial };
