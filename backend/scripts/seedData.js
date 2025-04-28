import { seedDatabase } from '../data/sampleData.js';
import connectDB from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const runSeed = async () => {
  try {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error running seed script:', error);
    process.exit(1);
  }
};

runSeed(); 