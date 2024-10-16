const courseService = require('../services/courseService');
const responseHelper = require('../helpers/responseHelper');


const createCourse = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    
    const imagePath = req.file ? req.file.path : null;

    const course = await courseService.createCourse(title, description, req.user.id, category, tags, imagePath);
    
    responseHelper.successResponse(res, 'Course created successfully', course);
  } catch (error) {
    console.error(error.message);
    responseHelper.errorResponse(res, 'Server error');
  }
};




const getCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    responseHelper.successResponse(res, 'Courses retrieved successfully', courses);
  } catch (error) {
    console.error(error.message);
    responseHelper.errorResponse(res, 'Server error');
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return responseHelper.errorResponse(res, 'Course not found', 404);
    }

    responseHelper.successResponse(res, 'Course retrieved successfully', course);
  } catch (error) {
    console.error(error.message);
    responseHelper.errorResponse(res, 'Server error');
  }
};

const updateCourse = async (req, res) => {
  try {
    const { title, description, tags, category } = req.body;
    const course = await courseService.updateCourse(req.params.id, title, description, tags, category, req.user.id);
    responseHelper.successResponse(res, 'Course updated successfully', course);
  } catch (error) {
    console.error(error.message);
    responseHelper.errorResponse(res, 'Server error');
  }
};

const deleteCourse = async (req, res) => {
  try {
    await courseService.deleteCourse(req.params.id, req.user.id);
    responseHelper.successResponse(res, 'Course removed successfully');
  } catch (error) {
    console.error(error.message);
    responseHelper.errorResponse(res, 'Server error');
  }
};

const getCoursesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const courses = await courseService.getCoursesByCategory(category);

    if (!courses.length) {
      return res.status(404).json({ message: "No courses found for this category" });
    }

    res.status(200).json({ message: "Courses fetched successfully", courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const enrollInCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const enrollment = await courseService.enrollInCourse(userId, courseId);

    if (enrollment.alreadyEnrolled) {
      return res.status(400).json({ message: "You are already enrolled in this course" });
    }

    return res.status(200).json({ message: "Successfully enrolled in the course", enrollment });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};


const unenrollFromCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const unenrollmentResult = await courseService.unenrollFromCourse(userId, courseId);

    if (unenrollmentResult.notEnrolled) {
      return res.status(400).json({ message: "You are not enrolled in this course" });
    }

    return res.status(200).json({ message: "Successfully unenrolled from course: " + courseId });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getUserEnrolledCourses = async (req, res) => {
  const userId = req.user.id;
  try {
    const enrolledCourses = await courseService.getUserEnrolledCourses(userId);

    if (!enrolledCourses || enrolledCourses.length === 0) {
      return res.status(404).json({ message: "No enrolled courses found." });
    }

    return res.status(200).json({ enrolledCourses });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};


const updateProgress = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;
  const { progressData } = req.body;
  
  try {
    const updatedProgress = await courseService.updateProgress(userId, courseId, progressData);
    return res.status(200).json({ message: 'Progress updated successfully', progress: updatedProgress });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update progress', error: error.message });
  }
};


const getProgressForCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;
  try {
    const progress = await courseService.getProgressForCourse(userId, courseId);

    res.status(200).json(progress);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Failed to fetch progress for course', error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByCategory,
  enrollInCourse,
  unenrollFromCourse,
  getUserEnrolledCourses,
  updateProgress,
  getProgressForCourse
 };
