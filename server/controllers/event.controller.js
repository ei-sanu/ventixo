import {
  createEvent,
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

export const joinCurrentUserToEvent = asyncHandler(async (req, res) => {
  const event = await joinEvent({
    eventId: req.params.id,
    user: req.user,
  });

  return res.status(200).json({
    success: true,
    message: "Joined event successfully",
    data: {
      event,
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
