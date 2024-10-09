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


const updateProgress = async (userId, courseId, progressData) => {
  try {

    const progress = await Progress.findOne({ course: courseId, user: userId });
    if (!progress) {
      throw new Error('Not enrolled in course');
    }

    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const totalLessons = course.lessons.length;
    const totalQuizzes = course.lessons.reduce((acc, lesson) => acc + (lesson.quizzes?.length || 0), 0);
    const totalMaterials = course.lessons.reduce((acc, lesson) => acc + (lesson.materials?.length || 0), 0);

    const lessonsCompleted = progressData.lessonsCompleted || 0;
    const quizzesCompleted = progressData.quizzesCompleted || 0;
    const materialsCompleted = progressData.materialsCompleted || 0;

    let isProgressUpdated = false;

    if (lessonsCompleted > progress.lessonsCompleted) {
      progress.lessonsCompleted = lessonsCompleted;
      isProgressUpdated = true;
    }

    if (quizzesCompleted > progress.quizzesCompleted) {
      progress.quizzesCompleted = quizzesCompleted;
      isProgressUpdated = true;
    }

    if (materialsCompleted > progress.materialsCompleted) {
      progress.materialsCompleted = materialsCompleted;
      isProgressUpdated = true;
    }

    course.lessons.forEach(lesson => {
      const completedQuizzesForLesson = lesson.quizzes?.filter(quiz => progressData.quizzesCompleted.includes(quiz.id)).length || 0;
      const completedMaterialsForLesson = lesson.materials?.filter(material => progressData.materialsCompleted.includes(material.id)).length || 0;

      if (completedQuizzesForLesson === (lesson.quizzes?.length || 0) &&
          completedMaterialsForLesson === (lesson.materials?.length || 0)) {
        
      }
    });

    if (true) {
    const totalItems = totalLessons + totalQuizzes + totalMaterials;
    const completedItems = progress.quizzesCompleted + progress.materialsCompleted;

    const totalProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

      progress.percentage = Math.min(totalProgress, 100);
      progress.lastUpdated = Date.now();

      await progress.save();
    }

    return progress;

  } catch (error) {
    throw new Error(`Failed to update progress: ${error.message}`);
  }
};


const getProgressForCourse = async (userId, courseId) => {
  try {
    const progress = await Progress.findOne({ user: userId, course: courseId });
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

    return progress;
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
