import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Embedded MongoDB (dev only). Data is persisted in server-backend/.mongo-data
const startEmbedded = async () => {
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const dbPath = path.join(__dirname, "..", ".mongo-data");
  fs.mkdirSync(dbPath, { recursive: true });
  const mongod = await MongoMemoryServer.create({
    instance: { dbPath, storageEngine: "wiredTiger", port: 27018 },
  });
  console.log("Using embedded MongoDB (dev) – data stored in .mongo-data/");
  return mongod.getUri("resumestudio");
};

const connectDB = async () => {
  const uri = (process.env.MONGO_URI || "").trim();
  const isProd = process.env.NODE_ENV === "production";

  if (uri && uri.toLowerCase() !== "embedded") {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error("MongoDB connection failed:", error.message);
      if (isProd) process.exit(1);
      console.warn("Falling back to embedded MongoDB for development...");
    }
  } else if (isProd) {
    console.error("MONGO_URI is required in production");
    process.exit(1);
  }

  try {
    await mongoose.connect(await startEmbedded());
    console.log("MongoDB (embedded) connected");
  } catch (error) {
    console.error("Could not start any database:", error.message);
    process.exit(1);
  }
};

export default connectDB;
