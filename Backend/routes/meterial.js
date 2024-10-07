const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const learningController = require('../controllers/meterialController');
const learningValidator = require('../validators/meterialValidator');

const multer = require('multer');
const path = require('path');



// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/videos'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // Append the original file extension
    }
  });
  
  // Initialize multer with the defined storage
  const upload = multer({ storage });



router.post('/upload/:courseId/:lessonId', authMiddleware.verifyToken, upload.single('video'), learningController.uploadLearningMaterial);
router.get('/:courseId/:lessonId',authMiddleware.verifyToken,learningController.getLearningMaterial);
router.delete('/delete/:courseId/:lessonId/:materialId', authMiddleware.verifyToken, learningController.deleteLearningMaterial);

module.exports = router;