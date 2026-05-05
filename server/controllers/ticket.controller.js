import { validateTicket, getUserTickets } from "../services/ticket.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const validateTicketController = asyncHandler(async (req, res) => {
  const { ticketCode } = req.body;
  const ticket = await validateTicket(ticketCode);

  return res.status(200).json({
    success: true,
    message: "Ticket validated successfully",
    data: {
      ticket,
    },
  });
});

export const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await getUserTickets(req.user._id);

  return res.status(200).json({
    success: true,
    data: {
      tickets,
    },
  });
});
