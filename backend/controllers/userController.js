// controllers/userController.js
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// Get the profile of the logged-in user
export const getUserProfile = asyncHandler(async (req, res) => {
  // Fetch the user from the database using the user's ID (from the JWT token)
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json(user); // Return user data (excluding the password)
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  // Find the user by ID
  const user = await User.findById(req.user._id);

  if (user) {
    // Update user fields with new values or keep old values if not provided
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    
    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    // Update roles if provided
    if (req.body.roles && Array.isArray(req.body.roles)) {
      user.roles = req.body.roles;
    }
    
    // For workers, optionally update categories
    if (user.roles.includes('worker') && req.body.categories) {
      user.categories = req.body.categories;
    }

    // Save the updated user to the database
    const updatedUser = await user.save();

    // Return the updated user details (excluding password)
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      roles: updatedUser.roles,
      categories: updatedUser.categories
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Update user roles (admin only)
export const updateUserRoles = asyncHandler(async (req, res) => {
  const { userId, roles } = req.body;

  if (!userId || !roles || !Array.isArray(roles)) {
    res.status(400);
    throw new Error("User ID and roles array are required");
  }

  // Check valid roles
  const validRoles = ['customer', 'worker'];
  const areRolesValid = roles.every(role => validRoles.includes(role));
  
  if (!areRolesValid) {
    res.status(400);
    throw new Error(`Roles must be one of: ${validRoles.join(', ')}`);
  }

  // Find the user
  const user = await User.findById(userId);
  
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update roles
  user.roles = roles;

  // Save changes
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    roles: user.roles,
    message: "User roles updated successfully"
  });
});

// Get available workers by category
export const getWorkersByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // First, find workers who have the category skill
    const workers = await User.find({
      roles: { $in: ['worker'] },
      categories: { $in: [category] }
    }).select('name email phoneNumber rating categories profilePicture');

    if (!workers.length) {
      return res.status(404).json({ message: 'No workers found for this category.' });
    }

    // Now let's check which workers are already busy with an active request in this category
    // Import ServiceRequest model is needed
    const ServiceRequest = await import('../models/ServiceRequest.js').then(module => module.default);
    
    // Find active requests (Accepted status) in this category
    const activeRequests = await ServiceRequest.find({
      status: 'Accepted',
      category: category
    }).select('worker category');

    // Get the list of worker IDs who are already working on this category
    const busyWorkerIds = activeRequests.map(request => request.worker.toString());

    // Filter out busy workers
    const availableWorkers = workers.filter(worker => 
      !busyWorkerIds.includes(worker._id.toString())
    );

    if (!availableWorkers.length) {
      return res.status(404).json({ 
        message: 'All workers for this category are currently busy with other requests.' 
      });
    }

    res.status(200).json(availableWorkers);
  } catch (error) {
    console.error('Error fetching workers by category:', error);
    res.status(500).json({ message: 'Server error. Could not fetch workers.' });
  }
};
