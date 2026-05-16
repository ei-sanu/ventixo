import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";

const duplicateKeyMessage = (error) => {
  const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || "field";
  return `${field} already exists`;
};

export const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";
  let details = error.details || null;

  // Log all errors in development to catch "next is not a function"
  if (env.nodeEnv === "development") {
    console.error(`[ErrorHandler] Error caught:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
      statusCode
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  }

  if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${error.path}`;
  }

  if (error?.code === 11000) {
    statusCode = 409;
    message = duplicateKeyMessage(error);
  }

  if (statusCode >= 500 || env.nodeEnv === "development") {
    logger.error(message, {
      method: req?.method,
      path: req?.originalUrl,
      stack: error.stack,
      details: details || error.message,
    });
    console.error(`[Error] ${req?.method} ${req?.originalUrl} failed (${statusCode}):`, error);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(env.nodeEnv === "development" && { stack: error.stack }),
  });
};
