import Event from "../models/Event.js";
import User from "../models/User.js";
import Team from "../models/Team.js";
import { ApiError } from "../utils/ApiError.js";
import { generateTicket } from "./ticket.service.js";
import { generateTeamId } from "../utils/generateTeamId.js";

export const createEvent = async ({ organizer, payload }) => {
  const event = await Event.create({
    ...payload,
    organizer: organizer._id,
    status: "pending",
    isPublished: false,
  });

  await User.findByIdAndUpdate(organizer._id, {
    $addToSet: { createdEvents: event._id },
    $push: {
      notifications: {
        title: "Event Created",
        message: `Your event "${event.title}" has been submitted for approval.`,
        type: "info",
      },
    },
  });

  return Event.findById(event._id).populate("organizer", "username userId email");
};

export const getEventsCreatedByUser = async (userId) => {
  return Event.find({ organizer: userId })
    .select(
      "title description category teamType maxParticipants participants status isPublished date location createdAt",
    )
    .sort({ createdAt: -1 });
};

export const getEventById = async (eventId) => {
  const event = await Event.findById(eventId)
    .populate("organizer", "username firstName lastName email")
    .populate("participants", "username firstName lastName email userId");

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return event;
};

export const joinEvent = async ({ eventId, user, registrationDetails, members = [] }) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (String(event.organizer) === String(user._id)) {
    throw new ApiError(409, "Organizer cannot join their own event");
  }

  if (event.status !== "approved" || !event.isPublished) {
    throw new ApiError(409, "Event is not open for joining");
  }

  const teamType = registrationDetails.teamType || "Solo";
  const teamName = registrationDetails.teamName || `${user.username}'s Team`;
  
  // Basic members check
  const allMembers = [
    { email: user.email, userId: user.userId, user: user._id, status: "registered" },
    ...members
  ];

  if (allMembers.length > event.maxParticipants) {
    throw new ApiError(400, `Team exceeds event limit of ${event.maxParticipants}`);
  }

  // Check if anyone in this team is already registered for this event
  const memberEmails = allMembers.map(m => m.email.toLowerCase());
  const existingTeams = await Team.find({
    event: eventId,
    "members.email": { $in: memberEmails }
  });

  if (existingTeams.length > 0) {
    throw new ApiError(400, "One or more members are already registered for this event");
  }

  const teamId = await generateTeamId();
  
  // Resolve existing users for all members
  const resolvedMembers = await Promise.all(allMembers.map(async (m) => {
    if (m.user) return m; // Already resolved (leader)
    
    const query = {};
    if (m.userId) query.userId = m.userId;
    else query.email = m.email.toLowerCase();

    const existingUser = await User.findOne(query);
    return {
      ...m,
      user: existingUser ? existingUser._id : undefined,
      email: m.email.toLowerCase(),
      status: existingUser ? "registered" : "pending"
    };
  }));

  const team = await Team.create({
    name: teamName,
    teamId,
    event: eventId,
    leader: user._id,
    members: resolvedMembers,
    teamType
  });

  // Create tickets for all resolved users
  const tickets = await Promise.all(resolvedMembers.filter(m => m.user).map(async (m) => {
    const ticket = await generateTicket({
      eventId,
      userId: m.user,
      registrationDetails: {
        ...registrationDetails,
        email: m.email,
        teamId,
        teamName
      }
    });
    
    // Link ticket to team
    ticket.team = team._id;
    await ticket.save();

    // Update User joinedEvents
    await User.findByIdAndUpdate(m.user, {
      $addToSet: { joinedEvents: eventId },
      $push: {
        notifications: {
          title: "Registration Successful",
          message: `You have been added to team "${teamName}" for ${event.title}.`,
          type: "success",
        },
      },
    });

    return ticket;
  }));

  // Update Event participants with all registered users
  const registeredUserIds = resolvedMembers.filter(m => m.user).map(m => m.user);
  await Event.findByIdAndUpdate(eventId, {
    $addToSet: { participants: { $each: registeredUserIds } }
  });

  return { team, tickets };
};

export const getOngoingEvents = async () => {
  return Event.find({
    status: "approved",
    isPublished: true,
  })
    .select(
      "title description category teamType maxParticipants participants organizer date location createdAt",
    )
    .populate("organizer", "username userId")
    .sort({ date: 1, createdAt: -1 })
    .limit(3);
};

export const getAllEvents = async () => {
  return Event.find()
    .populate("organizer", "username userId email")
    .populate("participants", "username userId")
    .sort({ createdAt: -1 });
};

export const approveEvent = async (eventId) => {
  const event = await Event.findByIdAndUpdate(
    eventId,
    {
      status: "approved",
      isPublished: true,
    },
    { new: true, runValidators: true },
  ).populate("organizer", "username userId email");

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return event;
};

export const rejectEvent = async (eventId) => {
  const event = await Event.findByIdAndUpdate(
    eventId,
    {
      status: "rejected",
      isPublished: false,
    },
    { new: true, runValidators: true },
  ).populate("organizer", "username userId email");

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return event;
};
