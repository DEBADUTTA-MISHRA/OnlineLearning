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
    const course = await Course.findById(courseId);

    if (!course) {
      throw new Error('Course not found');
    }

    const totalLessons = course.lessons.length;
    const totalQuizzes = course.lessons.quizzes.length;

    const lessonsCompleted = progressData.lessonsCompleted || 0;
    const quizzesCompleted = progressData.quizzesCompleted || 0;

    const lessonProgress = totalLessons > 0 ? (lessonsCompleted / totalLessons) * 100 : 0;
    const quizProgress = totalQuizzes > 0 ? (quizzesCompleted / totalQuizzes) * 100 : 0;

    const totalProgress = (lessonProgress + quizProgress) / 2;

    let progress = await Progress.findOneAndUpdate(
      { user: userId, course: courseId },
      {
        course: courseId,
        user: userId,
        totalLessons: totalLessons,
        lessonsCompleted: lessonsCompleted,
        quizzesCompleted: quizzesCompleted,
        percentage: totalProgress,
        lastUpdated: Date.now(),
      },
      { upsert: true, new: true }
    );

    return progress;
  } catch (error) {
    throw new Error(`Failed to update progress: ${error.message}`);
  }
};


const getProgressForCourse = async (userId, courseId) => {
  try {
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId }).populate('progress');
        
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    if (!enrollment.progress) {
      return {
        lessonsCompleted: 0,
        totalLessons: 0,
        percentage: 0,
        message: "No progress yet for this course",
      };
    }

    return enrollment.progress;
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
