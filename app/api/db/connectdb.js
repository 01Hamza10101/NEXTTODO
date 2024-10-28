import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI || !DB_NAME) {
  throw new Error('Please define MONGODB_URI and DB_NAME in your .env.local file');
}

// Connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Retry for 5 seconds
      socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Optionally, retry or log the error here. Avoid process.exit in production:
    process.exit(1);
  }
};

export default connectDB;
