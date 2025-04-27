import express from 'express';
import { registerUser, loginUser, getUser, updateUser, deleteUser, uploadProfileImage, removeProfilePicture } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';  // Middleware to protect routes
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profiles';
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `user-${req.user._id}-${uniqueSuffix}${extension}`);
  }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Public Routes
router.post('/register', registerUser);  // Route for registering a new user
router.post('/login', loginUser);  // Route for logging in

// Protected Routes (Requires authentication)
router.get('/user', protect, getUser);  // Route to get user data (protected)
router.put('/user', protect, updateUser);  // Route to update user data (protected)
router.delete('/user', protect, deleteUser);  // Route to delete user account (protected)
router.post('/upload-profile-image', protect, upload.single('profileImage'), uploadProfileImage); // Route to upload profile image
router.post('/remove-profile-image', protect, removeProfilePicture); // Route to remove profile image

export default router;
