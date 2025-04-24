import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use MONGO_URI from environment variables or fallback to a local MongoDB instance
    const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/community-care';
    
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
