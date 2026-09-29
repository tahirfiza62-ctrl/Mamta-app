
const mongoose = require("mongoose");

/* =========================================================
   CONNECT TO MONGODB
========================================================= */

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from backend/.env"
      );
    }

    const conn = await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      `MongoDB connected: ${conn.connection.host}`
    );

    return conn;
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    throw error;
  }
};

module.exports = connectDB;
