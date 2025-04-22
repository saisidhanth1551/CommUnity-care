import express from 'express'; // ES Module import
import { 
  createRequest, 
  getAllRequests, 
  getMyRequests, 
  acceptRequest, 
  completeRequest 
} from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isWorker, isCustomer } from '../middleware/roleMiddleware.js'; // Import role middleware

const router = express.Router();

// @route   POST /api/requests
// @desc    Create a new service request
// @access  Private (Customer)
router.post('/', protect, isCustomer, createRequest);

// @route   GET /api/requests
// @desc    Get all service requests (Admin/Worker)
// @access  Private (Worker/Admin)
router.get('/', protect, isWorker, getAllRequests);

// @route   GET /api/requests/my
// @desc    Get service requests created by logged-in customer
// @access  Private (Customer)
router.get('/my', protect, isCustomer, getMyRequests);

// @route   PUT /api/requests/:id/accept
// @desc    Worker accepts a request
// @access  Private (Worker)
router.put('/:id/accept', protect, isWorker, acceptRequest);

// @route   PUT /api/requests/:id/complete
// @desc    Mark request as completed
// @access  Private (Worker or Customer)
router.put('/:id/complete', protect, [isWorker, isCustomer], completeRequest); // Allow both Worker and Customer

// Default export (ES Module)
export default router;
