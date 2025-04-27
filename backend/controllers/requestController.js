import ServiceRequest from '../models/ServiceRequest.js';
import User from '../models/User.js';

// Create a new service request
export const createRequest = async (req, res) => {
  try {
    const { title, description, category, location, status, workerId } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const formattedStatus = status
      ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      : 'Pending';

    const validStatuses = ['Pending', 'Assigned', 'Accepted', 'Completed', 'Rejected'];
    if (!validStatuses.includes(formattedStatus)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    // Create request object
    const newRequest = new ServiceRequest({
      title,
      description,
      category,
      location,
      status: formattedStatus,
      customer: req.user._id,
    });

    // If workerId is provided, validate and set the worker
    if (workerId) {
      // Check if worker exists and is valid
      const worker = await User.findById(workerId);
      if (!worker) {
        return res.status(404).json({ message: 'Selected worker not found.' });
      }
      
      if (!worker.roles.includes('worker')) {
        return res.status(400).json({ message: 'Selected user is not a worker.' });
      }
      
      // Set the worker and update status to 'Assigned' (waiting for worker confirmation)
      newRequest.worker = workerId;
      newRequest.status = 'Assigned';
      newRequest.isWorkerConfirmed = false;
    }

    await newRequest.save();
    res.status(201).json({ message: 'Service request created successfully.', request: newRequest });
  } catch (error) {
    console.error('Error creating service request:', error);
    res.status(500).json({ message: 'Server error. Could not create request.' });
  }
};

// Get all service requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('customer', 'name phoneNumber email profilePicture')
      .populate('worker', 'name phoneNumber email profilePicture');

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching all requests:', error);
    res.status(500).json({ message: 'Server error. Could not retrieve requests.' });
  }
};

// Get current user's requests (Customer)
export const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ customer: req.user._id })
      .populate('customer', 'name phoneNumber email profilePicture')
      .populate('worker', 'name phoneNumber email profilePicture');

    if (!requests.length) {
      return res.status(404).json({ message: 'No service requests found for your account.' });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ message: 'Server error. Could not retrieve your requests.' });
  }
};

// Accept a service request (Worker)
export const acceptRequest = async (req, res) => {
  try {
    console.log('Accept request initiated by user:', req.user._id);
    console.log('User roles:', req.user.roles);
    
    const { id } = req.params;
    console.log('Request ID to accept:', id);
    
    const request = await ServiceRequest.findById(id);

    if (!request) {
      console.log('Request not found with ID:', id);
      return res.status(404).json({ message: 'Request not found.' });
    }
    
    console.log('Found request with status:', request.status);
    console.log('Request worker ID:', request.worker);
    console.log('User ID (req.user._id):', req.user._id);
    
    // Check if worker role exists
    if (!req.user.roles.includes('worker')) {
      console.log('User does not have worker role:', req.user.roles);
      return res.status(403).json({ message: 'Worker role required to accept requests.' });
    }

    // Check if the request is pending or assigned
    if (request.status !== 'Pending' && request.status !== 'Assigned') {
      console.log('Invalid request status for acceptance:', request.status);
      return res.status(400).json({ message: `Request already ${request.status.toLowerCase()}.` });
    }

    // For assigned requests, check if this worker is the assigned one
    if (request.status === 'Assigned' && request.worker) {
      const requestWorkerId = request.worker.toString();
      const currentUserId = req.user._id.toString();
      
      console.log('Request worker ID (string):', requestWorkerId);
      console.log('Current user ID (string):', currentUserId);
      console.log('IDs match?', requestWorkerId === currentUserId);
      
      if (requestWorkerId !== currentUserId) {
        return res.status(403).json({ message: 'This request is assigned to another worker.' });
      }
    } else {
      // For pending requests, set the worker
      request.worker = req.user._id;
    }

    request.status = 'Accepted';
    request.isWorkerConfirmed = true;

    const updatedRequest = await request.save();
    console.log('Request accepted and saved successfully');
    
    res.status(200).json({ 
      message: 'Request accepted successfully.', 
      request: updatedRequest 
    });
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({ 
      message: 'Server error. Could not accept request.',
      error: error.message
    });
  }
};

// Reject a service request (Worker)
export const rejectRequest = async (req, res) => {
  try {
    console.log('Reject request initiated by user:', req.user._id);
    console.log('User roles:', req.user.roles);
    
    const { id } = req.params;
    const { rejectionMessage } = req.body; // Get the rejection message from request body
    console.log('Request ID to reject:', id);
    
    const request = await ServiceRequest.findById(id);

    if (!request) {
      console.log('Request not found with ID:', id);
      return res.status(404).json({ message: 'Request not found.' });
    }
    
    console.log('Found request with status:', request.status);
    console.log('Request worker ID:', request.worker);
    console.log('User ID (req.user._id):', req.user._id);
    
    // Check if worker role exists
    if (!req.user.roles.includes('worker')) {
      console.log('User does not have worker role:', req.user.roles);
      return res.status(403).json({ message: 'Worker role required to reject requests.' });
    }

    if (request.status !== 'Assigned') {
      console.log('Invalid request status for rejection:', request.status);
      return res.status(400).json({ message: 'Only assigned requests can be rejected.' });
    }

    if (!request.worker) {
      return res.status(400).json({ message: 'This request does not have an assigned worker.' });
    }
    
    const requestWorkerId = request.worker.toString();
    const currentUserId = req.user._id.toString();
    
    console.log('Request worker ID (string):', requestWorkerId);
    console.log('Current user ID (string):', currentUserId);
    console.log('IDs match?', requestWorkerId === currentUserId);
    
    if (requestWorkerId !== currentUserId) {
      return res.status(403).json({ message: 'You are not authorized to reject this request.' });
    }

    // Set status to rejected
    request.status = 'Rejected';
    request.isWorkerConfirmed = false;
    
    // Save the rejection message if provided
    if (rejectionMessage) {
      request.rejectionMessage = rejectionMessage;
      console.log('Added rejection message:', rejectionMessage);
    }

    const updatedRequest = await request.save();
    console.log('Request rejected and saved successfully');
    
    res.status(200).json({ 
      message: 'Request rejected.', 
      request: updatedRequest 
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ 
      message: 'Server error. Could not reject request.',
      error: error.message
    });
  }
};

// Complete a service request (Worker)
export const completeRequest = async (req, res) => {
  try {
    console.log('Complete request initiated by user:', req.user._id);
    console.log('User roles:', req.user.roles);
    
    const { id } = req.params;
    console.log('Request ID to complete:', id);
    
    const request = await ServiceRequest.findById(id)
      .populate('customer', 'name email phoneNumber profilePicture')
      .populate('worker', 'name email phoneNumber profilePicture');

    if (!request) {
      console.log('Request not found with ID:', id);
      return res.status(404).json({ message: 'Request not found.' });
    }
    
    console.log('Found request with status:', request.status);
    
    // Verify the user is the assigned worker
    if (!request.worker || request.worker._id.toString() !== req.user._id.toString()) {
      console.log('User is not authorized to complete this request');
      return res.status(403).json({ message: 'You are not authorized to complete this request.' });
    }

    // Check if request is in the correct state
    if (request.status !== 'Accepted') {
      console.log('Invalid request status for completion:', request.status);
      return res.status(400).json({ 
        message: `Only accepted requests can be completed. Current status: ${request.status}.` 
      });
    }

    // Update request to completed
    request.status = 'Completed';
    const updatedRequest = await request.save();
    
    console.log('Request completed successfully');
    
    // TODO: Send notification to customer (email/SMS) - implement in future

    res.status(200).json({ 
      message: 'Request has been marked as completed.',
      request: updatedRequest 
    });
  } catch (error) {
    console.error('Error completing request:', error);
    res.status(500).json({ 
      message: 'Server error. Could not complete request.',
      error: error.message
    });
  }
};

// Cancel a service request (Customer)
export const cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ServiceRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Verify that the user is the customer who created the request
    if (request.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to cancel this request.' });
    }

    // Only Pending or Assigned requests can be cancelled
    if (request.status !== 'Pending' && request.status !== 'Assigned') {
      return res.status(400).json({ 
        message: 'Only pending or assigned requests can be cancelled.' 
      });
    }

    await ServiceRequest.findByIdAndDelete(id);
    res.status(200).json({ message: 'Request has been cancelled successfully.' });
  } catch (error) {
    console.error('Error cancelling request:', error);
    res.status(500).json({ message: 'Server error. Could not cancel request.' });
  }
};
