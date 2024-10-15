const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authValidator = require('../validators/authValidator');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authValidator.register, authController.register);

router.post('/login', authValidator.login, authController.login);

router.post('/social-login', authController.socialLogin);

router.post('/contact', authController.sendMessage);

// Route to request password reset
router.post('/forgot-password', authController.forgotPassword);

// Route to reset password (after receiving token/OTP)
router.post('/reset-password', authController.resetPassword);

router.get('/user/profile', authMiddleware.verifyToken, authController.getUserProfile);

router.put('/user/profile/update', authMiddleware.verifyToken, authController.updateUserProfile);

module.exports = router;
