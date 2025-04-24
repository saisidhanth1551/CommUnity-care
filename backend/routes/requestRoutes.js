import express from 'express';
import { createRequest, getAllRequests, getMyRequests, acceptRequest, completeRequest, rejectRequest, cancelRequest } from '../controllers/requestController.js';
import { protect, hasRole, hasAnyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a new service request (customers only)
router.post('/', protect, hasAnyRole(['customer']), createRequest);

// Route to get all requests (admins and workers can access this)
router.get('/', protect, hasAnyRole(['admin', 'worker']), getAllRequests);

// Route to get requests for a specific customer (only for the logged-in customer)
router.get('/my', protect, getMyRequests);

// Route to accept a service request (only for workers)
router.put('/accept/:id', protect, hasAnyRole(['worker']), acceptRequest);

// Route to reject a service request (for assigned workers)
router.put('/reject/:id', protect, hasAnyRole(['worker']), rejectRequest);

// Route to complete a service request (only for accepted worker)
router.put('/complete/:id', protect, completeRequest);

// Route to cancel a service request (only for the customer who created it)
router.delete('/:id', protect, hasAnyRole(['customer']), cancelRequest);

export default router;
