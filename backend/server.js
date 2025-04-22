import express from 'express'; // ES Modules import
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; // Import authentication routes
import requestRoutes from './routes/requestRoutes.js'; // Import service request routes
import connectDB from './config/db.js'; // DB connection file
import { errorHandler } from './middleware/errorMiddleware.js'; // Custom error handling middleware
import { protect } from './middleware/authMiddleware.js'; // Import protect middleware for authenticated routes

dotenv.config(); // Load environment variables

// Initialize Express app
const app = express();

// Test route to verify the server is running
app.get("/", (req, res) => {
  res.send("Welcome to CommUnity Care API");
});

// Connect to MongoDB database
connectDB();

// Middleware for CORS and JSON parsing
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/requests', protect, requestRoutes); // Service request routes protected by JWT

// Error handling middleware
app.use(errorHandler);

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
