import { approveEvent, getAllEvents, rejectEvent } from "../services/event.service.js";
import { searchUsers } from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listEvents = asyncHandler(async (_req, res) => {
  const events = await getAllEvents();

  return res.status(200).json({
    success: true,
    data: {
      events,
    },
  });
});

export const approveEventById = asyncHandler(async (req, res) => {
  const event = await approveEvent(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Event approved successfully",
    data: {
      event,
    },
  });
});

export const rejectEventById = asyncHandler(async (req, res) => {
  const event = await rejectEvent(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Event rejected successfully",
    data: {
      event,
    },
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await searchUsers({
    username: req.query.username,
    userId: req.query.userId,
  });

  return res.status(200).json({
    success: true,
    data: {
      users,
    },
  });
});
