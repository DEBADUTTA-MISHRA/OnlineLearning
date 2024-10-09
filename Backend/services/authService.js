const User = require('../models/user');
const commonHelper = require('../helpers/commonHelper');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const router = require('../routes/meterial');


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

  let user = await User.findOne({ socialId: userProfile.sub || userProfile.id, provider });
  
  if (!user) {
    user = new User({
      name: userProfile.name,
      email: userProfile.email,
      socialId: userProfile.sub || userProfile.id,
      provider,
      role: 'student',
      profilePicture: userProfile.picture ? userProfile.picture.data.url : null,
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

module.exports = {
  registerUser,
  authenticateUser,
  socialLogin,
  getUserProfile,
  updateUserProfile
 };
