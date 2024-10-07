const Course = require('../models/course');


// const uploadLearningMaterial = async (courseId, lessonId, materialData) => {
//   try {
//     console.log("courseId",courseId);
//     console.log("lessonId",lessonId);
//     console.log("materialData",materialData);
//     const { type, url, title, description, duration } = materialData;

//     const course = await Course.findById(courseId);
//     if (!course) {
//       throw new Error('Course not found');
//     }

//     const lesson = course.lessons.id(lessonId); // Find lesson by ID within the course
//     if (!lesson) {
//       throw new Error('Lesson not found');
//     }

//     lesson.learningMaterials.push({ type, url, title, description, duration });

//     await course.save(); // Save the updated course with the new material inside the lesson

//     return { message: 'Learning material uploaded successfully' };
//   } catch (error) {
//     throw new Error(`Failed to upload learning material: ${error.message}`);
//   }
// };




const uploadLearningMaterial = async (courseId, lessonId, materialData) => {
  try {
    const { type, url, title, description, duration } = materialData;

    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const lesson = course.lessons.id(lessonId); // Find lesson by ID within the course
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    lesson.learningMaterials.push({ type, url, title, description, duration });

    await course.save(); // Save the updated course with the new material inside the lesson

    return { message: 'Learning material uploaded successfully' };
  } catch (error) {
    throw new Error(`Failed to upload learning material: ${error.message}`);
  }
};






const getLearningMaterial = async (courseId, lessonId, materialId) => {
  try {
    // Find the course by its ID
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Find the lesson within the course by its ID
    const lesson = course.lessons.id(lessonId); // Use .id() to find the subdocument
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Return the material found
    return lesson.learningMaterials;
  } catch (error) {
    throw new Error(`Failed to get learning material: ${error.message}`);
  }
};



const deleteLearningMaterial = async (courseId, lessonId, materialId) => {
  try {
    // Find the course by its ID
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Filter out the material to be deleted by comparing the material's ID
    lesson.learningMaterials = lesson.learningMaterials.filter(material => !material._id.equals(materialId));

    // Save the updated course document
    await course.save();

    return { message: 'Learning material deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete learning material: ${error.message}`);
  }
};


module.exports = { uploadLearningMaterial, getLearningMaterial, deleteLearningMaterial };
