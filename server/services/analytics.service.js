import Event from "../models/Event.js";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";

export const getDashboardStats = async () => {
  const [totalEvents, totalUsers, totalTickets] = await Promise.all([
    Event.countDocuments(),
    User.countDocuments(),
    Ticket.countDocuments(),
  ]);

  const eventsByCategory = await Event.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $project: { category: "$_id", count: 1, _id: 0 } },
  ]);

  const recentEvents = await Event.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("organizer", "username email");

  const ticketsByStatus = await Ticket.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $project: { status: "$_id", count: 1, _id: 0 } },
  ]);

  return {
    overview: {
      totalEvents,
      totalUsers,
      totalTickets,
    },
    eventsByCategory,
    ticketsByStatus,
    recentEvents,
  };
};
