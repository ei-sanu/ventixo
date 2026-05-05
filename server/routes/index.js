import { Router } from "express";
import adminRoutes from "./admin.routes.js";
import eventRoutes from "./event.routes.js";
import userRoutes from "./user.routes.js";
import ticketRoutes from "./ticket.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import { updateCurrentUserProfile } from "../controllers/user.controller.js";
import { attachUser, requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Ventixo API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Explicitly define this route here to ensure it's matched
router.patch("/users/me", requireAuth, attachUser, updateCurrentUserProfile);

router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/tickets", ticketRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/admin", adminRoutes);

export default router;
