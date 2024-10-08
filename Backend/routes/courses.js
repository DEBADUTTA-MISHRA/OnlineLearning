const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');
const courseValidator = require('../validators/courseValidator');
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join('uploads', 'image'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });


router.post('/create', authMiddleware.verifyToken,upload.single('image'), courseController.createCourse);

router.get('/',authMiddleware.verifyToken, courseController.getCourses);

router.put('/update/:id', authMiddleware.verifyToken, courseController.updateCourse);

router.delete('/delete/:id', authMiddleware.verifyToken, courseController.deleteCourse);

router.get('/category/:category',authMiddleware.verifyToken, courseController.getCoursesByCategory);

router.post('/enroll/:courseId',authMiddleware.verifyToken, courseController.enrollInCourse);

router.post('/unenroll/:courseId',authMiddleware.verifyToken, courseController.unenrollFromCourse);

router.get('/enrolled',authMiddleware.verifyToken, courseController.getUserEnrolledCourses);

router.get('/:id',authMiddleware.verifyToken, courseValidator.validateId, courseController.getCourseById);

router.post('/progress/:courseId',authMiddleware.verifyToken, courseController.updateProgress);

router.get('/progress/:courseId',authMiddleware.verifyToken, courseController.getProgressForCourse);

module.exports = router;
