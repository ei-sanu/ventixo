import { clerkClient } from "@clerk/express";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { escapeRegex } from "../utils/escapeRegex.js";
import { generateUserId } from "../utils/generateUserId.js";

const DEFAULT_USERNAME = "ventixo_user";

const isAdmin = (email) => {
  if (!email) return false;
  return env.adminEmails.some((adminEmail) => adminEmail.toLowerCase() === email.toLowerCase());
};

const normalizeUsername = (value) => {
  if (!value) return "";

  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const buildBaseUsername = ({ providedUsername, email }) => {
  const preferredUsername = normalizeUsername(providedUsername);
  if (preferredUsername.length >= 3) {
    return preferredUsername.slice(0, 30);
  }

  const emailUsername = normalizeUsername(email?.split("@")[0]);
  if (emailUsername.length >= 3) {
    return emailUsername.slice(0, 30);
  }

  return DEFAULT_USERNAME;
};

const resolveUniqueUsername = async (baseUsername, clerkId) => {
  const normalizedBase = normalizeUsername(baseUsername) || DEFAULT_USERNAME;
  const maxAttempts = 25;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const suffix = attempt === 0 ? "" : `_${attempt}`;
    const maxBaseLength = Math.max(3, 30 - suffix.length);
    const candidate = `${normalizedBase.slice(0, maxBaseLength)}${suffix}`;
    const takenByAnotherUser = await User.exists({
      username: candidate,
      clerkId: { $ne: clerkId },
    });

    if (!takenByAnotherUser) {
      return candidate;
    }
  }

  throw new ApiError(409, "Unable to find an available username");
};

const getPrimaryEmail = (clerkUser) => {
  if (clerkUser.primaryEmailAddress?.emailAddress) {
    return clerkUser.primaryEmailAddress.emailAddress;
  }

  return clerkUser.emailAddresses?.[0]?.emailAddress || null;
};

export const syncUser = async ({ clerkId, username: providedUsername }) => {
  const clerkUser = await clerkClient.users.getUser(clerkId);
  const email = getPrimaryEmail(clerkUser);

  if (!email) {
    throw new ApiError(422, "A verified email address is required to create a profile");
  }

  console.log(`[Sync] Syncing user: ${email}, isAdmin: ${isAdmin(email)}, adminEmails: ${env.adminEmails}`);

  const existingUser = await User.findOne({ clerkId });

  if (existingUser) {
    existingUser.email = email;
    existingUser.role = isAdmin(email) ? "admin" : existingUser.role;

    const requestedUsername = normalizeUsername(providedUsername);
    if (requestedUsername && requestedUsername !== existingUser.username) {
      existingUser.username = await resolveUniqueUsername(requestedUsername, clerkId);
    }

    await existingUser.save();
    return { user: existingUser, created: false };
  }

  const username = await resolveUniqueUsername(
    buildBaseUsername({ providedUsername, email }),
    clerkId,
  );

  const maxAttempts = 5;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const userId = await generateUserId();
      const user = await User.create({
        clerkId,
        username,
        userId,
        email,
        role: isAdmin(email) ? "admin" : "user",
      });

      return { user, created: true };
    } catch (error) {
      if (error?.code === 11000 && error?.keyPattern?.userId) {
        continue;
      }

      if (error?.code === 11000 && error?.keyPattern?.username) {
        const resolvedUsername = await resolveUniqueUsername(`${username}_${attempt + 1}`, clerkId);
        const userId = await generateUserId();
        const user = await User.create({
          clerkId,
          username: resolvedUsername,
          userId,
          email,
          role: isAdmin(email) ? "admin" : "user",
        });

        return { user, created: true };
      }

      throw error;
    }
  }

  throw new ApiError(500, "Unable to create a unique user profile");
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId)
    .select("username userId email firstName lastName role createdEvents joinedEvents createdAt")
    .populate({
      path: "createdEvents",
      select: "title category teamType status isPublished date location createdAt",
    })
    .populate({
      path: "joinedEvents",
      select: "title category teamType status isPublished date location createdAt",
    });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const updateUserProfile = async (userId, { firstName, lastName }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        ...(firstName !== undefined && { firstName: firstName.trim() }),
        ...(lastName !== undefined && { lastName: lastName.trim() }),
      },
    },
    { new: true },
  ).select("username userId email firstName lastName role createdEvents joinedEvents createdAt");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const syncUserEvents = async (userId) => {
  const [createdEvents, joinedEvents] = await Promise.all([
    Event.find({ organizer: userId }).distinct("_id"),
    Event.find({ participants: userId }).distinct("_id"),
  ]);

  const user = await User.findByIdAndUpdate(
    userId,
    { createdEvents, joinedEvents },
    { new: true, runValidators: true },
  );

  return user;
};

export const searchUsers = async ({ username, userId }) => {
  const filters = {};

  if (username) {
    filters.username = { $regex: escapeRegex(username.toLowerCase()), $options: "i" };
  }

  if (userId) {
    filters.userId = { $regex: `^${escapeRegex(userId)}` };
  }

  const users = await User.find(filters)
    .select("username userId email role createdAt createdEvents joinedEvents")
    .sort({ createdAt: -1 })
    .limit(50);

  return users.map((u) => ({
    ...u.toObject(),
    createdCount: u.createdEvents?.length || 0,
    joinedCount: u.joinedEvents?.length || 0,
  }));
};
