import ServiceRequest from '../models/ServiceRequest.js'; // Import ServiceRequest model

// Function to create a new service request
export const createRequest = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    // Validate the fields
    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new service request
    const newRequest = new ServiceRequest({
      title,
      description,
      category,
      location,
      customer: req.user._id, // Attach logged-in user's ID as the customer
    });

    // Save the service request
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest); // Return the saved request
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get all service requests (for Admin/Worker)
export const getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('customer', 'name email') // Populate the customer details
      .populate('worker', 'name email'); // Optionally populate the worker details if assigned
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

    res.status(200).json(requests); // Always return 200 with results (even if empty)
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to accept a service request (by worker)
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

    // Assign the worker to the request
    request.worker = req.user._id;
    request.status = 'Accepted';

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to complete a service request (by worker or customer)
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

    // Complete the request (both customer and worker can complete)
    request.status = 'Completed';

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
