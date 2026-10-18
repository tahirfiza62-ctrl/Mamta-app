
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "";

    // Diagnose the URI format without logging credentials.
    console.log("MongoDB URI diagnostics:", {
      exists: Boolean(uri),
      length: uri.length,
      validPrefix:
        uri.startsWith("mongodb://") ||
        uri.startsWith("mongodb+srv://"),
      hasWhitespace: /\s/.test(uri),
      hasQuotes: /["']/.test(uri),
      hasAngleBracketPlaceholder: /[<>]/.test(uri),
      hasEnvAssignmentPrefix: /^MONGO_URI\s*=/.test(uri),
      hasAtSign: uri.includes("@"),
      hasDatabasePath: /^mongodb(\+srv)?:\/\/[^/]+\/[^?]+/.test(uri),
    });

    if (!uri) {
      throw new Error("MONGO_URI is missing");
    }

    const conn = await mongoose.connect(uri);

    console.log("MongoDB database:", conn.connection.name);
    console.log("MongoDB connected:", conn.connection.host);

    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
