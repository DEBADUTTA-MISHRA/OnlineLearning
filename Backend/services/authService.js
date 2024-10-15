const User = require('../models/user');
const commonHelper = require('../helpers/commonHelper');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const router = require('../routes/meterial');
const emailHelper = require('../helpers/emailHelper');
const crypto = require('crypto');


const registerUser = async (name, email, password) => {
  let user = await User.findOne({ email });
  if (user) {
    throw new Error('User already exists');
  }

  const hashedPassword = await commonHelper.hashPassword(password);

  user = new User({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();
  return user;
};

const authenticateUser = async (email, password) => {
  let user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await commonHelper.comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Wrong Password provided!');
  }

  return user;
};

const socialLogin = async (provider, accessToken) => {
  let userProfile;

  if (provider === 'google') {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: accessToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    userProfile = ticket.getPayload();
  } 
  else if (provider === 'facebook') {
    const response = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`);
    userProfile = response.data;
  } 
  else {
    throw new Error('Unsupported provider');
  }

  let user = await User.findOne({ email: userProfile.email });
  if (!user) {
    user = new User({
      name: userProfile.name,
      email: userProfile.email,
      socialId: userProfile.sub || userProfile.id,
      provider,
      role: 'student',
    });
    await user.save();
  }

  return user;
};


const getUserProfile = async (userId) => {
  try {
      const user = await User.findById(userId).select('-password');
      return user;
  } catch (error) {
      throw new Error('User not found');
  }
};

const updateUserProfile = async (userId, updateData) => {
  try {
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
      return updatedUser;
  } catch (error) {
      throw new Error('Error updating user profile');
  }
};

const sendMessage = async (name,email,message) =>{
  if (!name || !email || !message) {
    return 'All fields are required';
  }

  try {
    await emailHelper.sendQueryMessage(name, email, message);
    return 'Message sent successfully';
  } catch (error) {
    return 'Failed to send message';
  }
}

const sendOtp = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP and expiry (e.g., 10 minutes from now)
  user.resetOtp = otp;
  user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
  await user.save();

  // Send OTP to email
  await emailHelper.sendOtpEmail(user.email, otp);

  return 'OTP sent successfully';
};

const verifyOtpAndResetPassword = async (email, otp, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  // Check if OTP matches and is still valid
  if (user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
    throw new Error('Invalid or expired OTP');
  }


  const hashedPassword = await commonHelper.hashPassword(newPassword);

 // Update the password and remove OTP fields
 user.password = hashedPassword;
 user.resetOtp = undefined;
 user.resetOtpExpires = undefined;
 await user.save();

 return 'Password reset successful';
};


module.exports = {
  registerUser,
  authenticateUser,
  socialLogin,
  getUserProfile,
  updateUserProfile,
  sendMessage,
  sendOtp,
  verifyOtpAndResetPassword
 };
