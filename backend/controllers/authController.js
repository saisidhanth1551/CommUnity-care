import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// Generate JWT token (only with user ID, roles are stored in DB)
const generateToken = (id, roles) => {
  return jwt.sign({ id, roles }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register new user
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, roles } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Ensure roles is always an array
  const userRoles = Array.isArray(roles) ? roles : [roles || "customer"];

  // Create the user in the database
  const user = await User.create({
    name,
    email,
    password, // Mongoose schema will hash this password
    roles: userRoles,
  });
  console.log("Registered roles:", user.roles);

  if (user) {
    const token = generateToken(user._id, user.roles);
    res.status(201).json({ token });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  console.log("Login attempt:", email, role);

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('Invalid credentials');
  }

  console.log("User roles from DB:", user.roles);

  // Role validation if role is provided in the login request
  if (role) {
    const normalizedRoles = Array.isArray(user.roles) ? user.roles.map(r => r.toLowerCase()) : [];
    const requestedRole = role.toLowerCase();

    if (!normalizedRoles.includes(requestedRole)) {
      console.log("Role mismatch");
      return res.status(403).json({ message: `You don't have the '${requestedRole}' role.` });
    }
  }

  // Password matching
  const isMatch = await user.matchPassword(password);
  console.log("Password match:", isMatch);

  if (!isMatch) {
    console.log("Password mismatch");
    res.status(400);
    throw new Error('Invalid credentials');
  }

  // Generate a token after successful login
  const token = generateToken(user._id, user.roles);
  res.json({ message: 'Login successful', token, roles: user.roles });
});

// Get user data
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

// Update user data
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true }
  );

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

// Delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({ message: 'User deleted successfully' });
});
