import express from 'express'; // ES Modules import
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; // Import authentication routes
import requestRoutes from './routes/requestRoutes.js'; // Import service request routes
import userRoutes from './routes/userRoutes.js'; // Import user routes
import ratingRoutes from './routes/ratingRoutes.js'; // Import rating routes
import connectDB from './config/db.js'; // DB connection file
import { errorHandler } from './middleware/errorMiddleware.js'; // Custom error handling middleware
import { protect } from './middleware/authMiddleware.js'; // Import protect middleware for authenticated routes
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Load environment variables

// Initialize Express app
const app = express();

// Middleware for CORS and JSON parsing
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Test route to verify the server is running
app.get("/", (req, res) => {
  res.send("Welcome to CommUnity Care API");
});

// Connect to MongoDB database
connectDB();

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/requests', requestRoutes); // Service request routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/ratings', ratingRoutes); // Rating routes

// Error handling middleware
app.use(errorHandler);

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
