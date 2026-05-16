import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

const duplicateKeyMessage = (error) => {
  const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || "field";
  return `${field} already exists`;
};

export const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (error, req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";
  let details = error.details || null;

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

  if (statusCode >= 500) {
    logger.error(message, {
      method: req.method,
      path: req.originalUrl,
      stack: error.stack,
    });
    // Also log to console.error directly for visibility
    console.error(`[Error] ${req.method} ${req.path} failed:`, error);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
};
