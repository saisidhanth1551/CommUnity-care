import express from 'express';
import {
  createRequest,
  getAllRequests,
  getMyRequests,
  acceptRequest,
  completeRequest,
} from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a new request
router.post('/', protect, createRequest);

// Route to get all requests (for admin/worker)
router.get('/', protect, getAllRequests);

// ✅ This is the route you're trying to access from frontend
router.get('/my', protect, getMyRequests);

// Route to accept a request
router.put('/accept/:id', protect, acceptRequest);

// Route to complete a request
router.put('/complete/:id', protect, completeRequest);

export default router;
