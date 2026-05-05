import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import { env } from "./env.js";

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;

export const connectDB = async (retryCount = 0) => {
  mongoose.set("strictQuery", true);

  try {
    const maskedUri = env.mongoUri.replace(/:([^@]+)@/, ":****@");
    logger.info(`MongoDB attempting connection to: ${maskedUri}`);

    const connection = await mongoose.connect(env.mongoUri, {
      dbName: "ventixo",
      autoIndex: true,
    });

    logger.info(`MongoDB connected: ${connection.connection.host} / ${connection.connection.name}`);

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected. Attempting to reconnect...");
      connectDB();
    });
  } catch (error) {
    logger.error(`MongoDB connection attempt ${retryCount + 1} failed:`, error.message);

    if (retryCount < MAX_RETRIES) {
      logger.info(`Retrying connection in ${RETRY_INTERVAL / 1000} seconds...`);
      setTimeout(() => connectDB(retryCount + 1), RETRY_INTERVAL);
    } else {
      logger.error("Max MongoDB connection retries reached. Exiting...");
      process.exit(1);
    }
  }
};
