
const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is missing from environment variables");
  }

  // Log only safe information; never log the URI or credentials.
  console.log("MongoDB URI check:", {
    length: uri.length,
    startsWithMongoDBSRV: uri.startsWith("mongodb+srv://"),
    startsWithMongoDB: uri.startsWith("mongodb://"),
  });

  try {
    const conn = await mongoose.connect(uri);

    console.log("MongoDB connected successfully");
    console.log("Database:", conn.connection.name);
    console.log("Host:", conn.connection.host);

    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
