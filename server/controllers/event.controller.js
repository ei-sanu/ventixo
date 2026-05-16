import Event from "../models/Event.js";
import {
  createEvent,
  getEventById,
  getEventsCreatedByUser,
  getOngoingEvents,
  joinEvent,
} from "../services/event.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCurrentUserEvent = asyncHandler(async (req, res) => {
  const event = await createEvent({
    organizer: req.user,
    payload: req.body,
  });

  return res.status(201).json({
    success: true,
    message: "Event submitted for approval",
    data: {
      event,
    },
  });
});

export const getMyEvents = asyncHandler(async (req, res) => {
  const events = await getEventsCreatedByUser(req.user._id);

  return res.status(200).json({
    success: true,
    data: {
      events,
    },
  });
});

import Ticket from "../models/Ticket.js";

export const getEventDetails = asyncHandler(async (req, res) => {
  const event = await getEventById(req.params.id);
  
  // If the requester is the organizer, fetch tickets to show registration details
  let tickets = [];
  if (req.user && String(event.organizer._id) === String(req.user._id)) {
    tickets = await Ticket.find({ event: event._id }).populate("user", "username email firstName lastName userId");
  }

  return res.status(200).json({
    success: true,
    data: {
      event,
      tickets,
    },
  });
});

export const joinCurrentUserToEvent = asyncHandler(async (req, res) => {
  const { registrationDetails, members } = req.body;
  const { team, tickets } = await joinEvent({
    eventId: req.params.id,
    user: req.user,
    registrationDetails,
    members,
  });

  return res.status(200).json({
    success: true,
    message: "Joined event successfully",
    data: {
      team,
      tickets,
    },
  });
});

export const getOngoingPublishedEvents = asyncHandler(async (_req, res) => {
  const events = await getOngoingEvents();

  return res.status(200).json({
    success: true,
    data: {
      events,
    },
  });
});

export const getPublicEvents = asyncHandler(async (_req, res) => {
  const events = await Event.find({
    status: "approved",
    isPublished: true,
  })
    .populate("organizer", "username firstName lastName")
    .sort({ date: 1, createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: {
      events,
    },
  });
});
