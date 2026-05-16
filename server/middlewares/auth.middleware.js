import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAuth = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

export const attachUser = asyncHandler(async (req, res, next) => {
  if (!req.userId) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, env.jwtSecret);
        req.userId = decoded.userId;
      } catch (error) {
        // Silently fail if token is invalid
      }
    }
  }

  if (!req.userId) {
    throw new ApiError(401, "Authentication required");
  }

  const user = await User.findOne({ userId: req.userId });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  req.user = user;
  return next();
});

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Authenticated user profile required"));
  }

  if (req.user.role !== "admin") {
    return next(new ApiError(403, "Admin access required"));
  }

  return next();
};
