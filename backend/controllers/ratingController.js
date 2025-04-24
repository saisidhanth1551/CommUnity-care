import ServiceRequest from '../models/ServiceRequest.js';
import User from '../models/User.js';

/**
 * Rate a worker for a completed service request
 * @route POST /api/ratings
 * @access Private/Customer
 */
export const rateWorker = async (req, res) => {
  try {
    const { requestId, workerId, rating, feedback } = req.body;
    
    // Validate input
    if (!requestId || !workerId || !rating) {
      return res.status(400).json({ 
        message: 'Request ID, worker ID, and rating are required' 
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }
    
    // Find the service request
    const request = await ServiceRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Service request not found' });
    }
    
    // Verify the user is the customer who created the request
    if (request.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'You are not authorized to rate this service' 
      });
    }
    
    // Verify the request is completed
    if (request.status !== 'Completed') {
      return res.status(400).json({ 
        message: 'Only completed services can be rated' 
      });
    }
    
    // Verify the request hasn't already been rated
    if (request.isRated) {
      return res.status(400).json({ 
        message: 'This service has already been rated' 
      });
    }
    
    // Verify the worker matches
    if (request.worker.toString() !== workerId) {
      return res.status(400).json({ 
        message: 'Worker ID does not match the assigned worker' 
      });
    }
    
    // Find the worker
    const worker = await User.findById(workerId);
    
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    
    // Update the service request with the rating
    request.workerRating = rating;
    request.workerFeedback = feedback || null;
    request.isRated = true;
    
    const savedRequest = await request.save();
    
    // Update the worker's overall rating
    // Get all rated requests for this worker
    const ratedRequests = await ServiceRequest.find({
      worker: workerId,
      isRated: true
    });
    
    // Calculate the average rating
    const totalRating = ratedRequests.reduce((sum, req) => sum + req.workerRating, 0);
    const averageRating = totalRating / ratedRequests.length;
    
    // Update the worker's rating
    worker.rating = parseFloat(averageRating.toFixed(1)); // Round to 1 decimal place
    const savedWorker = await worker.save();
    
    res.status(200).json({
      message: 'Rating submitted successfully',
      rating,
      workerRating: worker.rating,
      request: {
        id: savedRequest._id,
        status: savedRequest.status,
        isRated: savedRequest.isRated,
        rating: savedRequest.workerRating
      }
    });
    
  } catch (error) {
    console.error('Error in rateWorker controller:', error);
    res.status(500).json({ 
      message: 'Server error. Could not submit rating.',
      error: error.message
    });
  }
};

/**
 * Get all ratings for a specific worker
 * @route GET /api/ratings/worker/:workerId
 * @access Public
 */
export const getWorkerRatings = async (req, res) => {
  try {
    const { workerId } = req.params;
    
    // Verify worker exists
    const worker = await User.findById(workerId);
    
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    
    // Get all rated requests for this worker
    const ratedRequests = await ServiceRequest.find({
      worker: workerId,
      isRated: true
    }).select('workerRating workerFeedback createdAt')
      .sort({ createdAt: -1 }); // Most recent first
    
    res.status(200).json({
      worker: {
        id: worker._id,
        name: worker.name,
        averageRating: worker.rating
      },
      ratings: ratedRequests
    });
    
  } catch (error) {
    console.error('Error fetching worker ratings:', error);
    res.status(500).json({ 
      message: 'Server error. Could not fetch ratings.' 
    });
  }
}; 