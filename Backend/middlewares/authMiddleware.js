const jwt = require('jsonwebtoken');
const responseHelper = require('../helpers/responseHelper');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return responseHelper.errorResponse(res, 'Access denied. No token provided.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (ex) {
    responseHelper.errorResponse(res, 'Invalid token.', 400);
  }
};

const generateToken = (user) => {
  const payload = {
    user: {
      id: user.id,
    },
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '365d' });
};

module.exports = { verifyToken, generateToken };
