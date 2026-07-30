const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const timeout = isProd ? 15000 : 5000;

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: timeout,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      console.error('Fatal production DB connection error. Retrying in 5s...');
      setTimeout(connectDB, 5000);
    } else {
      // Fallback for local development if MongoDB is not running locally
      console.log('Local MongoDB connection failed. Initializing MongoMemoryServer fallback...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const conn = await mongoose.connect(mongoServer.getUri());
        console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
      } catch (memError) {
        console.error(`MongoDB Memory Server failed: ${memError.message}`);
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
