const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2500, // Timeout after 2.5 seconds if local mongo is not running
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Local MongoDB connection failed (${error.message}). Starting MongoMemoryServer fallback...`);
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
    } catch (memError) {
      console.error(`MongoDB Memory Server failed: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
