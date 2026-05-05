import Ticket from "../models/Ticket.js";
import { ApiError } from "../utils/ApiError.js";
import crypto from "crypto";

export const generateTicket = async ({ eventId, userId }) => {
  const existingTicket = await Ticket.findOne({ event: eventId, user: userId });
  if (existingTicket) {
    return existingTicket;
  }

  const ticketCode = crypto.randomBytes(4).toString("hex").toUpperCase();

  const ticket = await Ticket.create({
    event: eventId,
    user: userId,
    ticketCode,
  });

  return ticket;
};

export const validateTicket = async (ticketCode) => {
  const ticket = await Ticket.findOne({ ticketCode }).populate("event").populate("user", "username userId");

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  if (ticket.status === "used") {
    throw new ApiError(409, "Ticket has already been used");
  }

  if (ticket.status === "cancelled") {
    throw new ApiError(409, "Ticket has been cancelled");
  }

  ticket.status = "used";
  ticket.validatedAt = new Date();
  await ticket.save();

  return ticket;
};

export const getUserTickets = async (userId) => {
  return Ticket.find({ user: userId }).populate("event").sort({ createdAt: -1 });
};
