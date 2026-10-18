
const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
console.log("MongoDB URI diagnostics:", {
  exists: Boolean(uri),
  length: uri?.length ?? 0,
  startsCorrectly:
    uri?.startsWith("mongodb+srv://") ||
    uri?.startsWith("mongodb://"),
  hasLeadingOrTrailingWhitespace: uri !== uri?.trim(),
  hasQuotes: uri?.includes('"') || uri?.includes("'"),
  hasAngleBrackets: /[<>]/.test(uri || ""),
  hasPlaceholder: /YOUR_USERNAME|YOUR_PASSWORD|xxxxx/i.test(uri || ""),
  hasLiteralBackslash: uri?.includes("\\"),
});
  if (!uri) {
    throw new Error(
      "MONGO_URI is missing from environment variables"
    );
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully");
    console.log("Database:", conn.connection.name);
    console.log("Host:", conn.connection.host);

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
