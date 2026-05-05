import Event from "../models/Event.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { generateTicket } from "./ticket.service.js";

export const createEvent = async ({ organizer, payload }) => {
  const event = await Event.create({
    ...payload,
    organizer: organizer._id,
    status: "pending",
    isPublished: false,
  });

  await User.findByIdAndUpdate(organizer._id, {
    $addToSet: { createdEvents: event._id },
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

export const joinEvent = async ({ eventId, user }) => {
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

  const alreadyJoined = event.participants.some(
    (participantId) => String(participantId) === String(user._id),
  );

  if (alreadyJoined) {
    throw new ApiError(409, "User already joined this event");
  }

  if (event.participants.length >= event.maxParticipants) {
    throw new ApiError(409, "Event has reached maximum participants");
  }

  const updatedEvent = await Event.findOneAndUpdate(
    {
      _id: event._id,
      participants: { $ne: user._id },
      $expr: { $lt: [{ $size: "$participants" }, "$maxParticipants"] },
    },
    {
      $addToSet: { participants: user._id },
    },
    { new: true, runValidators: true },
  )
    .select("title category teamType maxParticipants participants status isPublished date location")
    .populate("participants", "username userId");

  if (!updatedEvent) {
    throw new ApiError(409, "Event cannot be joined at this time");
  }

  await User.findByIdAndUpdate(user._id, {
    $addToSet: { joinedEvents: event._id },
  });

  await generateTicket({ eventId: event._id, userId: user._id });

  return updatedEvent;
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
