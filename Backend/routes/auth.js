const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authValidator = require('../validators/authValidator');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authValidator.register, authController.register);

router.post('/login', authValidator.login, authController.login);

router.post('/social-login', authController.socialLogin);

router.get('/user/profile', authMiddleware.verifyToken, authController.getUserProfile);

router.put('/user/profile/update', authMiddleware.verifyToken, authController.updateUserProfile);

module.exports = router;
