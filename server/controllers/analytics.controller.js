import { getDashboardStats } from "../services/analytics.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAnalyticsStats = asyncHandler(async (_req, res) => {
  const stats = await getDashboardStats();

  return res.status(200).json({
    success: true,
    data: stats,
  });
});
