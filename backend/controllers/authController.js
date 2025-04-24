import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// Generate JWT token with roles
const generateToken = (id, roles) => {
  // Add a fallback secret in case environment variable isn't loaded
  const jwtSecret = process.env.JWT_SECRET || 'CommUnityCare_JWT_Secret_Key_2024_secure_random_string';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '30d';
  
  console.log('Using JWT Secret:', jwtSecret ? 'Secret is set' : 'Secret is missing');
  
  return jwt.sign({ id, roles }, jwtSecret, { expiresIn: jwtExpiresIn });
};

// Register new user
export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, phoneNumber, roles, categories } = req.body;
    
    console.log('Registration request:', req.body);

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Handle roles
    let userRoles = [];
    if (roles && Array.isArray(roles)) {
      userRoles = roles;
    } else {
      userRoles = ['customer']; // Default
    }

    // Create password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in the database
    const userData = {
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      roles: userRoles
    };
    
    // Add categories only if user is a worker
    if (userRoles.includes('worker') && categories && Array.isArray(categories)) {
      userData.categories = categories;
    }
    
    console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });
    
    const user = await User.create(userData);
    console.log('User created:', user._id);

    if (user) {
      const token = generateToken(user._id, user.roles);
      res.status(201).json({ 
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          roles: user.roles,
          categories: user.categories
        }
      });
    } else {
      console.error('User creation failed but no error was thrown');
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      message: error.message || 'Registration failed',
      error: error
    });
  }
});

// Login user
export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', email);

    // Check if the user exists in the database using email
    let user = await User.findOne({ email });

    // If no user is found with the email, check using the phone number
    if (!user) {
      user = await User.findOne({ phoneNumber: email }); // Try phone number
    }

    if (!user) {
      console.log('User not found:', email);
      res.status(401);
      throw new Error('Invalid credentials');
    }

    console.log('User found:', user._id);

    // Password matching
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // Generate JWT token and send it back along with user info
    const token = generateToken(user._id, user.roles);
    res.json({ 
      message: 'Login successful', 
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        roles: user.roles,
        categories: user.categories
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(error.status || 400).json({
      message: error.message || 'Login failed',
      error: error
    });
  }
});

// Get user data
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

// Update user data
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, roles, categories } = req.body;

  const updateData = { 
    name, 
    email, 
    phoneNumber
  };
  
  if (roles && Array.isArray(roles)) {
    updateData.roles = roles;
  }
  
  // Only update categories if user is a worker
  if (updateData.roles?.includes('worker') && categories && Array.isArray(categories)) {
    updateData.categories = categories;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true }
  ).select('-password');

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
