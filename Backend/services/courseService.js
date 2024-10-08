const Course = require('../models/course');
const User = require('../models/user');
const Enrollment = require('../models/enrollment');
const Progress = require('../models/progress');



const createCourse = async (title, description, userId, category, tags, imagePath) => {
  const course = new Course({
    title,
    description,
    creator: userId,
    category,
    tags,
    image: imagePath,
  });

  await course.save();

  await User.findByIdAndUpdate(userId, {
    $addToSet: { createdCourses: course._id },
  });

  return course;
};



const getAllCourses = async () => {
  return await Course.find().populate('creator', 'name');
};

const getCourseById = async (courseId) => {
  return await Course.findById(courseId).populate('creator', 'name');
};

const updateCourse = async (courseId, title, description, tags, category, userId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  if (course.creator.toString() !== userId) {
    throw new Error('User not authorized');
  }

  course.title = title || course.title;
  course.description = description || course.description;
  course.tags = tags || course.tags;
  course.category = category || course.category;

  await course.save();
  return course;
};

const deleteCourse = async (courseId, userId) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error('Course not found');
  }

  if (course.creator.toString() !== userId) {
    throw new Error('User not authorized');
  }

  await course.deleteOne();
  return course;
};

const getCoursesByCategory = async (category) => {
  return await Course.find({ category });
};


const enrollInCourse = async (userId, courseId) => {
  const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
  
  if (existingEnrollment) {
    return { alreadyEnrolled: true };
  }

  const course = await Course.findById(courseId);
  
  if (!course) {
    throw new Error('Course not found');
  }

  const totalLessons = course.lessons.length;

  const newProgress = new Progress({
    user: userId,
    course: courseId,
    totalLessons: totalLessons,
    lessonsCompleted: 0,
    percentage: 0,
  });

  await newProgress.save();

  const newEnrollment = new Enrollment({
    user: userId,
    course: courseId,
    progress: newProgress._id,
  });
  
  await newEnrollment.save();

  await User.findByIdAndUpdate(
    userId,
    {
      $push: { enrolledCourses: { courseId, progress: 0, completed: false } },
    },
    { new: true }
  );

  return newEnrollment;
};



const unenrollFromCourse = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
  if (!enrollment) {
    return { notEnrolled: true };
  }

  await Enrollment.deleteOne({ user: userId, course: courseId });

  await User.findByIdAndUpdate(
    userId,
    { $pull: { enrolledCourses: { courseId: courseId } } },
    { new: true }
  );

  return { success: true };
};


const getUserEnrolledCourses = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'enrolledCourses.courseId',
    select: 'title description price isPublished'
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user.enrolledCourses;
};


// const updateProgress = async (userId, courseId, progressData) => {
//   try {

//     console.log("progressData in service:",progressData);
//     console.log("courseId",courseId);

//     const progress = await Progress.findOne({ course: courseId, user: userId });
//     console.log("course in progress:",progress);
//     if (!progress) {
//       throw new Error('Not enrolled in course');
//     }

//     // Get total number of lessons and quizzes from the lessons array
//     const totalLessons = progress.totalLessons;

//     const totalQuizzes = progress.totalMaterials;
//     const totalMaterials = progress.totalQuizzes;


//     // Get lessons, quizzes, and materials completed from progressData
//     const lessonsCompleted = progressData.progressData.lessonsCompleted || 0;
//     const quizzesCompleted = progressData.progressData.quizzesCompleted || 0;
//     const materialsCompleted = progressData.progressData.materialsCompleted || 0;

//     // Calculate lesson progress
//     const lessonProgress = totalLessons > 0 ? (lessonsCompleted / totalLessons) * 100 : 0;

//     // Calculate quiz progress
//     const quizProgress = totalQuizzes > 0 ? (quizzesCompleted / totalQuizzes) * 100 : 0;

//     // Calculate material progress
//     const materialProgress = totalMaterials > 0 ? (materialsCompleted / totalMaterials) * 100 : 0;

//     // Calculate total progress (average of lessons, quizzes, and materials)
//     const totalProgress = (lessonProgress + quizProgress + materialProgress) / 3;

//    // Update the progress record
//    progress.lessonsCompleted = lessonsCompleted;
//    progress.quizzesCompleted = quizzesCompleted;
//    progress.materialsCompleted = materialsCompleted;
//    progress.percentage = totalProgress;
//    progress.lastUpdated = Date.now();

//    // Save the updated progress
//    await progress.save();
//     console.log("progress after after update",progress);
//     return progress;
//   } catch (error) {
//     throw new Error(`Failed to update progress: ${error.message}`);
//   }
// };



const updateProgress = async (userId, courseId, progressData) => {
  try {
    console.log("progressData in service:", progressData);
    console.log("courseId", courseId);

    // Fetch the existing progress record
    const progress = await Progress.findOne({ course: courseId, user: userId });
    console.log("course in progress:", progress);
    if (!progress) {
      throw new Error('Not enrolled in course');
    }

    // Fetch the course details to get the lessons
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Get the total number of lessons, quizzes, and materials
    const totalLessons = course.lessons.length;
    console.log("totalLessons",totalLessons);
    const totalQuizzes = progress.totalQuizzes; // Update this if needed to reflect actual course data
    const totalMaterials = progress.totalMaterials; // Update this if needed to reflect actual course data

    // Get the lessons completed from the new progress data
    const lessonsCompleted = progressData.progressData.lessonsCompleted || 0;
    const quizzesCompleted = progressData.progressData.quizzesCompleted || 0;
    const materialsCompleted = progressData.progressData.materialsCompleted || 0;

    // Track whether we need to update the progress
    let isProgressUpdated = false;

    // Update lessons completed only if the new value is greater than the existing value
    if (lessonsCompleted > progress.lessonsCompleted) {
      progress.lessonsCompleted = lessonsCompleted;
      isProgressUpdated = true;
    }

    // Update quizzes completed only if the new value is greater than the existing value
    if (quizzesCompleted > progress.quizzesCompleted) {
      progress.quizzesCompleted = quizzesCompleted;
      isProgressUpdated = true;
    }

    // Update materials completed only if the new value is greater than the existing value
    if (materialsCompleted > progress.materialsCompleted) {
      progress.materialsCompleted = materialsCompleted;
      isProgressUpdated = true;
    }

   // Check if all materials and quizzes for each lesson are completed
const lessonsArray = course.lessons; // Get lessons from the fetched course
lessonsArray.forEach(lesson => {
  // Check if quizzes and materials are defined
  const completedQuizzesForLesson = Array.isArray(lesson.quizzes) ? 
    lesson.quizzes.filter(quiz => 
      progressData.progressData.quizzesCompleted > 0 && quiz.id === progressData.progressData.quizzesCompleted).length : 0;

  const completedMaterialsForLesson = Array.isArray(lesson.materials) ? 
    lesson.materials.filter(material => 
      progressData.progressData.materialsCompleted > 0 && material.id === progressData.progressData.materialsCompleted).length : 0;

  // Check if the lesson is completed
  if (completedQuizzesForLesson === (Array.isArray(lesson.quizzes) ? lesson.quizzes.length : 0) && 
      completedMaterialsForLesson === (Array.isArray(lesson.materials) ? lesson.materials.length : 0)) {
    progress.lessonsCompleted = Math.max(progress.lessonsCompleted, lesson.id); // Assuming lesson.id is used to mark completed lessons
    isProgressUpdated = true;
  }
});

    // Only update the percentage if any progress was updated
    if (isProgressUpdated) {
      // Calculate progress for lessons, quizzes, and materials
      const lessonProgress = totalLessons > 0 ? (progress.lessonsCompleted / totalLessons) * 100 : 0;
      const quizProgress = totalQuizzes > 0 ? (progress.quizzesCompleted / totalQuizzes) * 100 : 0;
      const materialProgress = totalMaterials > 0 ? (progress.materialsCompleted / totalMaterials) * 100 : 0;

      // Calculate total progress (average of lessons, quizzes, and materials progress)
      const totalProgress = (lessonProgress + quizProgress + materialProgress) / 3;

      // Ensure total progress doesn't exceed 100%
      progress.percentage = Math.min(progress.percentage + totalProgress, 100);
      progress.lastUpdated = Date.now();
    }

    // Save the updated progress if any changes were made
    if (isProgressUpdated) {
      await progress.save();
    }

    console.log("progress after update:", progress);
    return progress;

  } catch (error) {
    throw new Error(`Failed to update progress: ${error.message}`);
  }
};




const getProgressForCourse = async (userId, courseId) => {
  try {
    console.log("userId, courseId",userId, courseId)
    const progress = await Progress.findOne({ user: userId, course: courseId });
        console.log("course progress",progress.percentage);
    if (!progress) {
      throw new Error('Enrollment not found');
    }

    if (!progress.percentage) {
      return {
        lessonsCompleted: 0,
        totalLessons: 0,
        percentage: 0,
        message: "No progress yet for this course",
      };
    }

    return progress.percentage;
  } catch (error) {
    console.error(error.message);
    throw new Error('Failed to fetch progress for course');
  }
};


module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse, deleteCourse,
  getCoursesByCategory,
  enrollInCourse,
  unenrollFromCourse,
  getUserEnrolledCourses,
  updateProgress,
  getProgressForCourse
};
