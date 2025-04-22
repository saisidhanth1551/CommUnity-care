import express from 'express';
import { registerUser, loginUser, getUser, updateUser, deleteUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';  // Middleware to protect routes
const router = express.Router();

// Public Routes
router.post('/register', registerUser);  // Route for registering a new user
router.post('/login', loginUser);  // Route for logging in

// Protected Routes (Requires authentication)
router.get('/user', protect, getUser);  // Route to get user data (protected)
router.put('/user', protect, updateUser);  // Route to update user data (protected)
router.delete('/user', protect, deleteUser);  // Route to delete user account (protected)

export default router;
