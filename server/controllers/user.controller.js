import {
  getUserProfile,
  updateUserProfile,
  register,
  login,
} from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

export const registerUser = asyncHandler(async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;

  const user = await register({ email, password, username, firstName, lastName });

  const token = generateToken(res, user.userId);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user,
      token,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await login({ email, password });

  const token = generateToken(res, user.userId);

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      user,
      token,
    },
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user.userId);

  return res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

export const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;

  const user = await updateUserProfile(req.user._id, {
    $set: {
      ...(firstName !== undefined && { firstName: firstName.trim() }),
      ...(lastName !== undefined && { lastName: lastName.trim() }),
    },
  });

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      user,
    },
  });
});

export const markNotificationsAsRead = asyncHandler(async (req, res) => {
  const user = await updateUserProfile(req.user._id, {
    "notifications.$[].read": true,
  });

  return res.status(200).json({
    success: true,
    message: "Notifications marked as read",
    data: {
      user,
    },
  });
});
