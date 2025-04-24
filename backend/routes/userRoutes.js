// routes/userRoutes.js
import express from 'express';
import { protect, hasRole } from '../middleware/authMiddleware.js';
import { getUserProfile, updateUserProfile, getWorkersByCategory, updateUserRoles } from '../controllers/userController.js';

const router = express.Router();

// User profile routes
router.route('/profile').get(protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin route to update user roles
router.put('/roles', protect, hasRole('admin'), updateUserRoles);

// Get workers by category (made accessible without authentication for public view)
router.get('/workers/category/:category', getWorkersByCategory);

export default router;
