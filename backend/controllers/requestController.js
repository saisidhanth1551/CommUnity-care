import ServiceRequest from '../models/ServiceRequest.js'; // Import the fresh ServiceRequest model

// Function to create a new service request
export const createRequest = async (req, res) => {
  try {
    const { title, description, category, location, status } = req.body;

    const formattedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Pending';

    // Validate status
    const validStatuses = ['Pending', 'Accepted', 'Completed'];
    if (!validStatuses.includes(formattedStatus)) {
      return res.status(400).json({ message: 'Invalid status value. Please use "Pending", "Accepted", or "Completed".' });
    }

    const newRequest = new ServiceRequest({
      title,
      description,
      category,
      location,
      status: formattedStatus,  // Use formatted status
      customer: req.user._id,  // Use the authenticated user's ID for customer
    });

    await newRequest.save();
    res.status(201).json({ message: 'Service request created successfully', request: newRequest });
  } catch (error) {
    console.error("Error creating service request:", error);
    res.status(400).json({ message: error.message });
  }
};

// Function to get all service requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('customer', 'name email')
      .populate('worker', 'name email');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get service requests of a specific customer
export const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ customer: req.user._id })
      .populate('customer', 'name email')
      .populate('worker', 'name email');

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to accept a service request
export const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ServiceRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status === 'Accepted') {
      return res.status(400).json({ message: 'Request already accepted' });
    }

    request.worker = req.user._id;  // Assign the worker
    request.status = 'Accepted';

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to complete a service request
export const completeRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ServiceRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status === 'Completed') {
      return res.status(400).json({ message: 'Request already completed' });
    }

    request.status = 'Completed';  // Mark request as completed

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
