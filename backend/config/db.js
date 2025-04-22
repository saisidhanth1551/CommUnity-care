  import mongoose from 'mongoose';

  const connectDB = async () => {
    try {
      mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('MongoDB connected'))
      .catch((err) => console.error('MongoDB connection error:', err));

    } catch (error) {
      console.error('Error: ', error);
      process.exit(1);
    }
  };

  export default connectDB;
