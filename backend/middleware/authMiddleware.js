import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';  // Ensure the path to the User model is correct

// Protect routes requiring authentication
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if Authorization header exists and if it starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Extract token from Authorization header
    token = req.headers.authorization.split(' ')[1];
  }

  // If token is not found
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    // Verify the token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user based on the ID decoded from the token and attach to request object
    req.user = await User.findById(decoded.id).select('-password');  // Exclude password from the user object

    next();  // Continue to the next middleware/controller
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

export { protect };  // Export the protect middleware for use in other files
