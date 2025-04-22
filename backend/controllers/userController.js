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
