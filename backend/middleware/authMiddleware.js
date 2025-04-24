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

      // Add fallback JWT secret - must match the one in authController.js
      const jwtSecret = process.env.JWT_SECRET || 'CommUnityCare_JWT_Secret_Key_2024_secure_random_string';
      
      // Verify token
      const decoded = jwt.verify(token, jwtSecret);

      // Attach user to request, excluding the password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found for this token');
      }

      // Add roles from the token to the request if they exist
      if (decoded.roles) {
        req.userRoles = decoded.roles;
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

// Middleware to check if user has specific role
const hasRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authenticated');
    }

    const userRoles = req.user.roles || [];
    
    if (!userRoles.includes(role)) {
      res.status(403);
      throw new Error(`Access denied. Role '${role}' required.`);
    }
    
    next();
  };
};

// Middleware to check if user has any of the specified roles
const hasAnyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authenticated');
    }

    const userRoles = req.user.roles || [];
    
    const hasPermission = roles.some(role => userRoles.includes(role));
    
    if (!hasPermission) {
      res.status(403);
      throw new Error(`Access denied. One of roles [${roles.join(', ')}] required.`);
    }
    
    next();
  };
};

export { protect, hasRole, hasAnyRole };
