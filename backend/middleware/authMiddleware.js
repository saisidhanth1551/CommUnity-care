import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js'; // Ensure this path is correct

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the Authorization header is present and properly formatted
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request, excluding the password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found for this token');
      }

      next(); // Proceed to next middleware or controller
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect };
