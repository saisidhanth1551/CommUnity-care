import express from 'express';
import { rateWorker, getWorkerRatings } from '../controllers/ratingController.js';
import { protect, hasAnyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to submit a worker rating (only for customers)
router.post('/', protect, hasAnyRole(['customer']), rateWorker);

// Route to get all ratings for a specific worker
router.get('/worker/:workerId', getWorkerRatings);

export default router; 