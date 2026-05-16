import "../config/env.js";
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";

const cleanupIndexes = async () => {
  try {
    logger.info("Connecting to MongoDB for index cleanup...");
    await mongoose.connect(env.mongoUri);
    logger.info("Connected to MongoDB");

    const collections = await mongoose.connection.db.listCollections().toArray();
    const userShared = collections.find(c => c.name === "users");

    if (userShared) {
      const User = mongoose.connection.db.collection("users");
      const indexes = await User.indexes();
      logger.info(`Found ${indexes.length} indexes on 'users' collection`);

      const clerkIndex = indexes.find(idx => idx.name.includes("clerkId") || idx.key.clerkId);
      
      if (clerkIndex) {
        logger.info(`Dropping index: ${clerkIndex.name}`);
        await User.dropIndex(clerkIndex.name);
        logger.info("Successfully dropped clerkId index");
      } else {
        logger.info("No clerkId index found to drop");
      }
    } else {
      logger.warn("'users' collection not found");
    }

  } catch (error) {
    logger.error("Cleanup failed:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
    process.exit(0);
  }
};

cleanupIndexes();
