import User from "../models/User.js";
import Event from "../models/Event.js";
import Team from "../models/Team.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { generateTicket } from "./ticket.service.js";
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

const resolveUniqueUsername = async (baseUsername) => {
  const normalizedBase = normalizeUsername(baseUsername) || DEFAULT_USERNAME;
  const maxAttempts = 25;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const suffix = attempt === 0 ? "" : `_${attempt}`;
    const maxBaseLength = Math.max(3, 30 - suffix.length);
    const candidate = `${normalizedBase.slice(0, maxBaseLength)}${suffix}`;
    const takenByAnotherUser = await User.exists({
      username: candidate,
    });

    if (!takenByAnotherUser) {
      return candidate;
    }
  }

  throw new ApiError(409, "Unable to find an available username");
};

export const register = async ({ email, password, username: providedUsername, firstName, lastName }) => {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(400, "Email already in use");
  }

  const username = await resolveUniqueUsername(
    providedUsername || buildBaseUsername({ providedUsername, email }),
  );

  const maxAttempts = 5;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const userId = await generateUserId();
      const user = await User.create({
        username,
        userId,
        email,
        password,
        firstName: firstName || "",
        lastName: lastName || "",
        role: isAdmin(email) ? "admin" : "user",
      });

      // Auto-link pending team registrations
      await linkPendingTeamRegistrations(user);

      return user;
    } catch (error) {
      if (error?.code === 11000 && error?.keyPattern?.userId) {
        continue;
      }
      throw error;
    }
  }

  throw new ApiError(500, "Unable to create a unique user profile");
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  return user;
};

export const getUserProfile = async (userId) => {
  const user = await User.findOne({ userId })
    .select("username userId email firstName lastName role createdEvents joinedEvents notifications createdAt")
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

export const updateUserProfile = async (id, updates) => {
  const user = await User.findByIdAndUpdate(
    id,
    updates,
    { new: true },
  ).select("username userId email firstName lastName role createdEvents joinedEvents notifications createdAt");

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

export const isUsernameAvailable = async (username) => {
  const exists = await User.exists({ username: username.toLowerCase() });
  return !exists;
};

export const linkPendingTeamRegistrations = async (user) => {
  const pendingTeams = await Team.find({
    "members.email": user.email.toLowerCase(),
    "members.status": "pending"
  });

  for (const team of pendingTeams) {
    // Update member status
    await Team.updateOne(
      { _id: team._id, "members.email": user.email.toLowerCase() },
      { 
        $set: { 
          "members.$.status": "registered",
          "members.$.user": user._id,
          "members.$.userId": user.userId
        } 
      }
    );

    // Create ticket
    const event = await Event.findById(team.event);
    if (event) {
      const ticket = await generateTicket({
        eventId: event._id,
        userId: user._id,
        registrationDetails: {
          email: user.email,
          teamId: team.teamId,
          teamName: team.name
        }
      });
      
      ticket.team = team._id;
      await ticket.save();

      // Update User joinedEvents
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { joinedEvents: event._id },
        $push: {
          notifications: {
            title: "Added to Team",
            message: `You have been added to team "${team.name}" for ${event.title}.`,
            type: "success",
          },
        },
      });

      // Update Event participants
      await Event.findByIdAndUpdate(event._id, {
        $addToSet: { participants: user._id }
      });
    }
  }
};
