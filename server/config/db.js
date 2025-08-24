const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState >= 1) {
      console.log('MongoDB already connected');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      bufferCommands: false, // Disable mongoose buffering
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    // Don't exit process in serverless environment
    if (process.env.VERCEL) {
      console.error('Serverless environment detected - not exiting process');
      throw error; // Let the calling function handle the error
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;