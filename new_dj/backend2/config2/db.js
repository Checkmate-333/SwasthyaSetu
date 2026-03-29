const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Determine the MongoDB URI from the environment variables
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      console.warn("MONGO_URI is not defined in the environment variables. Please check your .env file.");
      return; // Early return if URI is missing to prevent crash on startup if DB is optional during local development, 
              // but typically we'd throw an error. Assuming graceful handling for now.
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
