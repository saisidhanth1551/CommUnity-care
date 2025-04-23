import express from 'express';
import { createRequest, getAllRequests, getMyRequests, acceptRequest, completeRequest } from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a new request
router.post('/', protect, createRequest);

// Route to get all requests (for admin/worker)
router.get('/', protect, getAllRequests);

// Route to get my requests (for customer)
router.get('/my', protect, getMyRequests);

// Route to accept a request (for worker)
router.put('/accept/:id', protect, acceptRequest);

// Route to complete a request (for worker or customer)
router.put('/complete/:id', protect, completeRequest);

export default router;
