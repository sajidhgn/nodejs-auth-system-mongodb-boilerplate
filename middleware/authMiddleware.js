const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {notFoundResponse, unauthorizedResponse} = require("../utils/apiResponses");

const auth = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        return notFoundResponse(res, "Access denied. No token provided.")
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id.id).select('-__v');

      if (!user) {
        return notFoundResponse(res, "Token is not valid.")
      }

      if (!user.isVerified) {
        return notFoundResponse(res, "Account is deactivated. Please contact support.")
      }

      // Check if user has required role
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return unauthorizedResponse(res, "Access denied. Insufficient permissions.")
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return notFoundResponse(res, "Token has expired.")
      }

      if (error.name === 'JsonWebTokenError') {
       return notFoundResponse(res, "Invalid Token.")
      }

     notFoundResponse(res, "Token is not valid.")
    }
  };
};

module.exports = auth;