const userService = require('../services/authService');
const responseHelper = require('../helpers/responseHelper');
const authMiddleware = require('../middlewares/authMiddleware');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await userService.registerUser(name, email, password);
    responseHelper.successResponse(res, 'User registered successfully');
  } catch (error) {
    console.error(error.message);
    responseHelper.errorResponse(res, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticateUser(email, password);
    const token = authMiddleware.generateToken(user);
    responseHelper.successResponse(res, 'Login successful', { token, name: user.name });
  } catch (error) {
    console.error(error.message);
    responseHelper.errorResponse(res, error.message);
  }
};

const socialLogin = async (req, res) => {
  try {
    const { provider, accessToken } = req.body;

    const user = await userService.socialLogin(provider, accessToken);
    const token = authMiddleware.generateToken(user);

    responseHelper.successResponse(res, 'User logged in successfully via social media.', { token, name: user.name });
  } catch (error) {
    console.error(error.message);
    responseHelper.errorResponse(res, error.message);
  }
};

const getUserProfile = async (req, res) => {
  try {
      
      const userId = req.user.id;

      const user = await userService.getUserProfile(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User profile fetched successfully', user });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
      const userId = req.user.id;
      const updateData = req.body;

      const updatedUser = await userService.updateUserProfile(userId, updateData);

      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
  } catch (error) {
      res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
};

const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;
  try {
  const result = userService.sendMessage({name,email,message});

  res.status(200).json({success:true,message:'Message sent successfully',result});
  } catch (error) {
    res.status(500).json({success:false, message:'Failed to send message',result});
  }
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await userService.sendOtp(email);
    res.status(200).json({ message: 'OTP sent to email', result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const result = await userService.verifyOtpAndResetPassword(email, otp, newPassword);
    res.status(200).json({ message: 'Password reset successful', result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
  


module.exports = { register, login, socialLogin, sendMessage, getUserProfile, updateUserProfile,forgotPassword, resetPassword };
