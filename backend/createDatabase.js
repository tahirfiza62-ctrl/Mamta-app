const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const createDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const db = mongoose.connection.db;

    await db.createCollection("users");

    await db.collection("users").insertOne({
      name: "MAMTA Test User",
      email: "test@mamta.pk",
      password: "temporary",
      role: "customer",
      active: true,
      createdAt: new Date(),
    });

    console.log("MAMTA database and users collection created!");
    console.log("Database:", db.databaseName);

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error("Database Error:", error.message);
    process.exit(1);
  }
};

createDatabase();