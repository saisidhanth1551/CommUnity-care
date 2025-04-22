// routes/userRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserProfile } from '../controllers/userController.js';

const router = express.Router();

// Protect the route with authentication middleware
router.route('/profile').get(protect, getUserProfile);

export default router;
