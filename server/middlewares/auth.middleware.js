import { getAuth } from "@clerk/express";
import User from "../models/User.js";
import { syncUser } from "../services/user.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAuth = (req, _res, next) => {
  const auth = getAuth(req);

  if (!auth?.isAuthenticated || !auth.userId) {
    return next(new ApiError(401, "Authentication required"));
  }

  req.clerkId = auth.userId;
  req.auth = auth;

  return next();
};

export const attachUser = asyncHandler(async (req, _res, next) => {
  const clerkId = req.clerkId || getAuth(req)?.userId;

  if (!clerkId) {
    throw new ApiError(401, "Authentication required");
  }

  let user = await User.findOne({ clerkId });

  if (!user) {
    const result = await syncUser({ clerkId });
    user = result.user;
  }

  req.user = user;
  return next();
});

export const requireAdmin = (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Authenticated user profile required"));
  }

  if (req.user.role !== "admin") {
    return next(new ApiError(403, "Admin access required"));
  }

  return next();
};
