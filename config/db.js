const mongoose = require('mongoose');

// Prevent Mongoose from throwing deprecation warnings
mongoose.set('strictQuery', true);

// MongoDB URI - Use environment variables in production
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/oxcody_db';

// Maintain a cached connection
let cachedConnection = null;

async function connectDB() {
  // Reuse existing connection if available
  if (cachedConnection) {
    console.log('🔁 Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(uri);

    cachedConnection = conn;
    console.log('✅ MongoDB Connected Successfully');
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
}

module.exports = connectDB;